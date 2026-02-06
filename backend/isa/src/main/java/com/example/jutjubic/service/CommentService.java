package com.example.jutjubic.service;

import com.example.jutjubic.dto.CommentDto;
import com.example.jutjubic.model.Comment;

public interface CommentService {
    Comment create(CommentDto commentDto);
}
