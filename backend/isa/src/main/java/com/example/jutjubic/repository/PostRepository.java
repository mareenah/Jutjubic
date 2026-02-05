package com.example.jutjubic.repository;

import com.example.jutjubic.model.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
    @Override
    List<Post> findAll(Sort sort);
    List<Post> findAllByUserId(UUID userId);
}
