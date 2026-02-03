package com.example.jutjubic.service;

import com.example.jutjubic.dto.PostDto;
import com.example.jutjubic.model.Post;

import java.io.IOException;
import java.util.List;

public interface PostService {
    List<Post> findAll();
    Post upload(PostDto postDto) throws IOException;
    byte[] findThumbnail(String path) throws IOException;
}
