package com.example.jutjubic.repository;

import com.example.jutjubic.model.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
    @Override
    List<Post> findAll(Sort sort);
    List<Post> findAllByUserId(UUID userId, Sort sort);

    @Modifying
    @Query("""
        UPDATE Post p
        SET p.views = p.views + 1
        WHERE p.id = :postId
    """)
    int incrementViews(@Param("postId") UUID postId);

    @Override
    void deleteById(UUID uuid);

}
