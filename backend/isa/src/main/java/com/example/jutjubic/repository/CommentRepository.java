package com.example.jutjubic.repository;

import com.example.jutjubic.model.Comment;
import com.example.jutjubic.model.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findAllByPostId(UUID postId, Sort sort);
}

