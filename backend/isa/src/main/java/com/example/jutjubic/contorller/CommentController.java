package com.example.jutjubic.contorller;

import com.example.jutjubic.dto.CommentDto;
import com.example.jutjubic.model.Comment;
import com.example.jutjubic.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping(value = "/create", consumes = "application/json")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> createComment(@Valid @RequestBody CommentDto commentDto) {
        return ResponseEntity.ok(commentService.create(commentDto));
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<Page<Comment>> findCommentsByPost(@PathVariable UUID id, @RequestParam int page, @RequestParam int size) {
        return ResponseEntity.ok(commentService.findCommentsByPost(id, page, size));
    }
}
