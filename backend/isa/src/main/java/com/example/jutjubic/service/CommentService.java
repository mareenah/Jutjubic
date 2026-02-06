package com.example.jutjubic.service;

import com.example.jutjubic.dto.CommentDto;
import com.example.jutjubic.model.Comment;

import java.util.List;
import java.util.UUID;

public interface CommentService {
    Comment create(CommentDto commentDto);
    List<Comment> findCommentsByPost(UUID postId);
}
