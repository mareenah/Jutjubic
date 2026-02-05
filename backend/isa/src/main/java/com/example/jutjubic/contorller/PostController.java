package com.example.jutjubic.contorller;

import com.example.jutjubic.dto.PostDto;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Value("${file.upload.base-dir}")
    private String baseUploadDir;

    @GetMapping(produces = "application/json")
    public List<Post> findAll() {
        return postService.findAll();

//        return postService.findAll().stream().map(post -> {
//            Post newPost = new Post();
//            newPost.setId(post.getId());
//            newPost.setTitle(post.getTitle());
//            newPost.setDescription(post.getDescription());
//            newPost.setTags(post.getTags());
//            newPost.setThumbnail("/api/posts/thumbnails/" + post.getThumbnail());
//            newPost.setVideo("/api/posts/videos/" + post.getVideo());
//            newPost.setCreatedAt(post.getCreatedAt());
//            newPost.setCountry(post.getCountry());
//            newPost.setCity(post.getCity());
//            newPost.setUser(post.getUser());
//            return newPost;
//        }).toList();
    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> upload(@Valid @ModelAttribute PostDto postDto) throws IOException, InterruptedException {
        return ResponseEntity.ok(postService.upload(postDto));
    }

    @GetMapping("/thumbnails/{name}")
    public ResponseEntity<byte[]> findThumbnail(@PathVariable String name) throws IOException {
        Path absolutePath = Paths.get(baseUploadDir, "thumbnails", name).toAbsolutePath();
        return ResponseEntity.ok(postService.findThumbnail(absolutePath.toString()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findPost(@PathVariable UUID id) {
        return ResponseEntity.ok(postService.findPostById(id));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Post>> findPostsByUser(@PathVariable UUID id) {
        List<Post> posts = postService.findPostsByUser(id);
        return ResponseEntity.ok(posts);
    }
}
