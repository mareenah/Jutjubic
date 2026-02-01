package com.example.jutjubic.contorller;

import com.example.jutjubic.dto.PostDto;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.service.PostService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping(value = "/", produces = "application/json")
    public List<Post> findAll() {
        return postService.findAll();
    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<Object> upload(@Valid @ModelAttribute PostDto postDto) throws IOException {
        return ResponseEntity.ok(postService.upload(postDto));
    }

}
