package com.example.jutjubic.service;

import com.example.jutjubic.dto.PostDto;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.model.User;
import com.example.jutjubic.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeoutException;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Value("${file.upload.base-dir}")
    private String baseUploadDir;

    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    @Override
    public List<Post> findAll() {
        return postRepository.findAll(Sort.by(Sort.Direction.DESC));
    }

    @Override
    public Post upload(PostDto postDto) throws IOException, InterruptedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You must be logged in to create a post.");

        if (postDto.getThumbnail() == null || postDto.getThumbnail().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thumbnail is required.");
        String contentType = postDto.getThumbnail().getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thumbnail must be an image file.");
        }

        Path videoPath = null;
        Path thumbnailPath = null;

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
            if (!tag.matches("^[\\p{L}\\p{N}_-]{2,30}$"))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid tag (min 2 characters): " + tag);
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

            MultipartFile video = postDto.getVideo();
            String videoFileName = UUID.randomUUID() + "_" + video.getOriginalFilename();
            Path videoDirPath = Paths.get(baseUploadDir, "videos").toAbsolutePath();
            Files.createDirectories(videoDirPath);
            Path videoAbsolutePath = videoDirPath.resolve(videoFileName);
            videoPath = videoAbsolutePath;

            InputStream in = video.getInputStream();
            OutputStream out = Files.newOutputStream(videoAbsolutePath);

            byte[] buffer = new byte[8192];
            int bytesRead;
            long start = System.currentTimeMillis();

            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
                out.flush();
                if (System.currentTimeMillis() - start > 10_000)
                    throw new ResponseStatusException(HttpStatus.REQUEST_TIMEOUT, "Video upload took too long");
            }

            String videoRelativePath = "videos/" + videoFileName;
            post.setVideoPath(videoRelativePath);

            MultipartFile thumbnail = postDto.getThumbnail();
            String thumbFileName = UUID.randomUUID() + "_" + thumbnail.getOriginalFilename();
            Path thumbDirPath = Paths.get(baseUploadDir, "thumbnails").toAbsolutePath();
            Files.createDirectories(thumbDirPath);
            Path thumbAbsolutePath = thumbDirPath.resolve(thumbFileName);
            Files.copy(thumbnail.getInputStream(), thumbAbsolutePath, StandardCopyOption.REPLACE_EXISTING);
            thumbnailPath = thumbAbsolutePath;
            String thumbRelativePath = "thumbnails/" + thumbFileName;
            post.setThumbnailUrl(thumbRelativePath);

            return postRepository.save(post);
        } catch (ResponseStatusException e) {
            if (videoPath != null) Files.deleteIfExists(videoPath);
            if (thumbnailPath != null) Files.deleteIfExists(thumbnailPath);
            log.info("Video and thumbnail files cleaned up.");
            throw e;
        } catch (Exception e) {
            if (videoPath != null) Files.deleteIfExists(videoPath);
            if (thumbnailPath != null) Files.deleteIfExists(thumbnailPath);
            log.info("Video and thumbnail files cleaned up.");
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error happened. Please try again.");
        }
    }

    @Override
    @Cacheable(value = "thumbnails", key = "#path")
    public byte[] findThumbnail(String path) throws IOException {
        log.info("Loading thumbnail from disk: {}", path);
        return Files.readAllBytes(Paths.get(path).toAbsolutePath());
    }
}