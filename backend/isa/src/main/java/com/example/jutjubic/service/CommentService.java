package com.example.jutjubic.service;

import com.example.jutjubic.dto.CommentDto;
import com.example.jutjubic.model.Comment;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface CommentService {
    Comment create(CommentDto commentDto);
    Page<Comment> findCommentsByPost(UUID postId, int page, int size);
    void validateRateLimit(UUID userId);
}
