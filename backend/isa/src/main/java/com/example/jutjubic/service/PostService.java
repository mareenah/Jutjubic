package com.example.jutjubic.service;

import com.example.jutjubic.dto.PostDto;
import com.example.jutjubic.model.Post;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface PostService {
    List<Post> findAll();

    Post upload(PostDto postDto);

    Post findPostById(UUID id);

    List<Post> findPostsByUser(UUID userId);

    Post mapToObject(Post post);
    long findLikesCount(UUID postId);
    boolean hasUserLiked(UUID postId, UUID userId);
    void toggleLike(UUID postId);
    void send50DemoMessages();
}
