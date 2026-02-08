package com.example.jutjubic.contorller;

import com.example.jutjubic.dto.PostDto;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
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

    @GetMapping(produces = "application/json")
    public List<Post> findAll() {
        return postService.findAll();
    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> upload(@Valid @ModelAttribute PostDto postDto) {
        return ResponseEntity.ok(postService.upload(postDto));
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

    @GetMapping(value = "/videos/{filename}", produces = "video/mp4")
    public ResponseEntity<Resource> streamVideo(@PathVariable String filename)
            throws IOException {

        Path path = Paths.get("uploads/videos", filename);
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .body(resource);
    }

}
