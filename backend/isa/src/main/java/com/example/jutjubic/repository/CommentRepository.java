package com.example.jutjubic.repository;

import com.example.jutjubic.model.Comment;
import com.example.jutjubic.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    Page<Comment> findAllByPostId(UUID postId, Pageable pageable);
    @Query("""
    SELECT COUNT(c) FROM Comment c
    WHERE c.user.id = :userId
    AND c.createdAt >= :since
    """)
    long countUserCommentsSince(UUID userId, Instant since);
}
