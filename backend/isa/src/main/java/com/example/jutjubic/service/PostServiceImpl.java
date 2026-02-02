package com.example.jutjubic.service;

import com.example.jutjubic.dto.PostDto;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.model.User;
import com.example.jutjubic.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Value("${file.upload.video-dir}")
    private String videoDir;

    @Value("uploads/thumbnails")
    private String thumbDir;

    @Override
    public List<Post> findAll() {
        return postRepository.findAll(Sort.by(Sort.Direction.DESC));
    }

    @Override
    public Post upload(PostDto postDto) throws IOException, InterruptedException {
        //Thread.sleep(35_000); // 35 seconds
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Path videoPath = null;
        Path thumbnailPath = null;
        try {
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
                if (image == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid image file.");
                }
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
                if (!tag.matches("^[\\p{L}\\p{N}_-]{2,30}$"))
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid tag (min 2 characters): " + tag);
            }

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

            MultipartFile video = postDto.getVideo();
            String videoFileName = UUID.randomUUID() + "_" + video.getOriginalFilename();
            Path uploadPath = Paths.get(videoDir).toAbsolutePath();
            Files.createDirectories(uploadPath);
            videoPath = uploadPath.resolve(videoFileName);
            Files.copy(video.getInputStream(), videoPath, StandardCopyOption.REPLACE_EXISTING);
            post.setVideoPath(videoPath.toString()); //TODO get path?

            MultipartFile thumbnail = postDto.getThumbnail();
            String thumbFileName = UUID.randomUUID() + "_" + thumbnail.getOriginalFilename();;
            uploadPath = Paths.get(thumbDir).toAbsolutePath();
            Files.createDirectories(uploadPath);
            thumbnailPath = uploadPath.resolve(thumbFileName);
            Files.copy(thumbnail.getInputStream(), thumbnailPath, StandardCopyOption.REPLACE_EXISTING);
            post.setThumbnailUrl(thumbnailPath.toString()); //TODO get path?

            return postRepository.save(post);
        } catch (Exception e) {
            if (videoPath != null) Files.deleteIfExists(videoPath);
            if (thumbnailPath != null) Files.deleteIfExists(thumbnailPath);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error happened. Please try again.");
        }
    }

    @Override
    @Cacheable(value = "thumbnails", key = "#path")
    public byte[] findThumbnail(String path) throws IOException {
        return Files.readAllBytes(Paths.get(path).toAbsolutePath());
    }
}