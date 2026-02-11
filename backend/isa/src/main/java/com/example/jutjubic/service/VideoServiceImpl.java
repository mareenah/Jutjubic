package com.example.jutjubic.service;

import com.example.jutjubic.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class VideoServiceImpl implements VideoService {

    @Autowired
    private PostRepository postRepository;

    @Override
    @Transactional
    public void incrementViews(UUID postId) {
        postRepository.incrementViews(postId);
    }


}