package com.example.jutjubic.contorller;

import com.example.jutjubic.dto.PostDto;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.service.PostService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Value("${file.upload.base-dir}")
    private String baseUploadDir;

    @GetMapping(value = "/", produces = "application/json")
    public List<Post> findAll() {
        return postService.findAll();
    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<Object> upload(@Valid @ModelAttribute PostDto postDto) throws IOException, InterruptedException {
        return ResponseEntity.ok(postService.upload(postDto));
    }

    @GetMapping("/thumbnails/{name}")
    public ResponseEntity<byte[]> findThumbnail(@PathVariable String name) throws IOException {
        Path absolutePath = Paths.get(baseUploadDir, "thumbnails", name).toAbsolutePath();
        return ResponseEntity.ok(postService.findThumbnail(absolutePath.toString()));
    }
}
