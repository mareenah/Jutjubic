package com.example.jutjubic.service;

import com.example.jutjubic.dto.UploadEventDto;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import com.example.jutjubic.dto.PostDto;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.model.PostLike;
import com.example.jutjubic.model.User;
import com.example.jutjubic.repository.PostLikeRepository;
import com.example.jutjubic.repository.PostRepository;
import com.example.jutjubic.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ThumbnailCacheService thumbnailCacheService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private VideoService videoService;

    @Value("${file.upload.base-dir}")
    private String baseUploadDir;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private UserRepository userRepository;

    private final ConnectionFactory rabbitFactory;

    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    public PostServiceImpl() {
        rabbitFactory = new ConnectionFactory();
        rabbitFactory.setHost("localhost");
        rabbitFactory.setUsername("guest");
        rabbitFactory.setPassword("guest");
    }

    @Override
    public List<Post> findAll() {
        List<Post> posts = postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::mapToObject)
                .toList();
        return posts;
    }

    @Override
    public Post mapToObject(Post post) {
        Post object = new Post();

        object.setId(post.getId());
        object.setTitle(post.getTitle());
        object.setDescription(post.getDescription());
        object.setTags(post.getTags());
        object.setCreatedAt(post.getCreatedAt());
        object.setCountry(post.getCountry());
        object.setCity(post.getCity());
        object.setUser(post.getUser());
        object.setVideo(post.getVideo());
        object.setViews(post.getViews());

        try {
            Path path = Paths.get("uploads/thumbnails", post.getThumbnail());
            String mimeType = Files.probeContentType(path);

            if (mimeType == null) {
                mimeType = URLConnection.guessContentTypeFromName(post.getThumbnail());
            }
            if (mimeType == null) {
                mimeType = "image/jpeg";
            }

            Path absolutePath = Paths.get(baseUploadDir, "thumbnails", post.getThumbnail()).toAbsolutePath();
            byte[] imageBytes = thumbnailCacheService.findThumbnail(absolutePath.toString());
            String base64 = Base64.getEncoder().encodeToString(imageBytes);
            String dataUri = "data:" + mimeType + ";base64," + base64;
            object.setThumbnail(dataUri);

        } catch (IOException e) {
            object.setThumbnail(null);
        }

        return object;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @PreAuthorize("isAuthenticated()")
    public Post upload(PostDto postDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You must be logged in to create a post.");

        if (postDto.getThumbnail() == null || postDto.getThumbnail().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thumbnail is required.");
        String contentType = postDto.getThumbnail().getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thumbnail must be an image file.");
        }

        try {
            BufferedImage image = ImageIO.read(postDto.getThumbnail().getInputStream());
            if (image == null)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid image file.");
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to read thumbnail image.");
        }

        if (postDto.getVideo() == null || postDto.getVideo().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Video is required.");
        String type = postDto.getVideo().getContentType();
        if (type == null || !type.equals("video/mp4"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Allowed only mp4 video files.");
        if (postDto.getVideo().getSize() > 200 * 1024 * 1024)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Too large video file (max 200MB).");

        for (String tag : postDto.getTags()) {
            if (!tag.matches("^[\\p{L}\\p{N}_-]{1,30}$"))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid tag (min 1 character): " + tag);
        }

        try {
            Post post = new Post();
            post.setId(UUID.randomUUID());
            post.setTags(postDto.getTags());
            post.setTitle(postDto.getTitle());
            post.setDescription(postDto.getDescription());
            post.setCreatedAt(Instant.now());
            post.setCountry(postDto.getCountry());
            post.setCity(postDto.getCity());
            User user = (User) auth.getPrincipal();
            post.setUser(user);
            post.setViews(0L);

            MultipartFile video = postDto.getVideo();
            String videoFileName = UUID.randomUUID() + "_" + video.getOriginalFilename();
            Path tmpVideo = fileStorageService.saveToTemp(postDto.getVideo(), videoFileName);
            post.setVideo(videoFileName);

            MultipartFile thumbnail = postDto.getThumbnail();
            String thumbFileName = UUID.randomUUID() + "_" + thumbnail.getOriginalFilename();
            Path tmpThumbnail = fileStorageService.saveToTemp(postDto.getThumbnail(), thumbFileName);
            post.setThumbnail(thumbFileName);

            Post postResponse = postRepository.save(post);

            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {

                        @Override
                        public void afterCommit() {
                            try {
                                fileStorageService.moveToFinal(tmpVideo, Paths.get("uploads/videos"));
                                fileStorageService.moveToFinal(tmpThumbnail, Paths.get("uploads/thumbnails"));
                                log.info("Video and thumbnail files saved.");
                            } catch (IOException e) {
                                log.error("File move failed after DB commit: ", e);
                                postRepository.deleteById(post.getId());
                                fileStorageService.deleteTemp(tmpVideo);
                                fileStorageService.deleteTemp(tmpThumbnail);
                            }
                        }

                        @Override
                        public void afterCompletion(int status) {
                            if (status != STATUS_COMMITTED) {
                                fileStorageService.deleteTemp(tmpVideo);
                                fileStorageService.deleteTemp(tmpThumbnail);
                                log.info("Transaction not commited. Temp files cleaned up.");
                            }
                        }
                    }

            );

            return postResponse;

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error happened. Please try again.");
        }
    }

    @Override
    public Post findPostById(UUID id){
        videoService.incrementViews(id);
        return postRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
    }

    @Override
    public List<Post> findPostsByUser(UUID userId) {
        return postRepository
                .findAllByUserId(
                        userId,
                        Sort.by(Sort.Direction.DESC, "createdAt")
                )
                .stream()
                .map(this::mapToObject)
                .toList();
    }

    @Override
    public long findLikesCount(UUID postId) {
        return postLikeRepository.countByPostId(postId);
    }

    @Override
    public boolean hasUserLiked(UUID postId, UUID userId) {
        return postLikeRepository.existsByPostIdAndUserId(postId, userId);
    }

    @Override
    @Transactional
    public void toggleLike(UUID postId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) auth.getPrincipal();
        UUID userId = authUser.getId();

        if (postLikeRepository.existsByPostIdAndUserId(postId, userId)) {
            postLikeRepository.deleteByPostIdAndUserId(postId, userId);
        } else {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

            PostLike like = new PostLike();
            like.setPost(post);
            like.setUser(user);

            postLikeRepository.save(like);
        }
    }

    @Override
    public void send50DemoMessages() {
        for (int i = 0; i < 50; i++) {
            int randomSize = ThreadLocalRandom.current().nextInt(0, 201);

            UploadEventDto dto = new UploadEventDto(
                    "video_" + i,
                    "Demo Title " + i,
                    "Demo Author " + i,
                    randomSize
            );
            try {
                sendMessageJson(dto);
                sendMessageProtobuf(dto);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void sendMessageJson(UploadEventDto dto) throws Exception {
        try (Connection connection = rabbitFactory.newConnection();
             Channel channel = connection.createChannel()) {

            channel.queueDeclare("upload_events_json", false, false, false, null);

            String json = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(dto);
            channel.basicPublish("", "upload_events_json", null, json.getBytes());
        }
    }

    private void sendMessageProtobuf(UploadEventDto dto) throws Exception {
        try (Connection connection = rabbitFactory.newConnection();
             Channel channel = connection.createChannel()) {

            channel.queueDeclare("upload_events_proto", false, false, false, null);

            protobuf.UploadEventOuterClass.UploadEvent protoMsg = protobuf.UploadEventOuterClass.UploadEvent.newBuilder()
                    .setVideoId(dto.getVideoId())
                    .setTitle(dto.getTitle())
                    .setAuthor(dto.getAuthor())
                    .setSizeMB(dto.getSizeMB())
                    .build();

            channel.basicPublish("", "upload_events_proto", null, protoMsg.toByteArray());
        }
    }

}