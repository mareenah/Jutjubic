package com.example.jutjubic;

import com.example.jutjubic.model.Post;
import com.example.jutjubic.repository.PostRepository;
import com.example.jutjubic.service.PostService;
import com.example.jutjubic.service.VideoService;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class VideoViewConcurrencyTest {

    @Autowired
    private VideoService videoService;

    @Autowired
    private PostRepository postRepository;

    private static final Logger logger = LoggerFactory.getLogger(VideoViewConcurrencyTest.class);

    @Test
    void shouldCorrectlyIncrementViewsWithConcurrentUsers() throws Exception {

        Post post = postRepository.save(new Post());
        UUID postId = post.getId();

        int users = 50;

        ExecutorService executor = Executors.newFixedThreadPool(10);
        CountDownLatch latch = new CountDownLatch(users);

        for (int i = 0; i < users; i++) {
            executor.submit(() -> {
                try {
                    videoService.incrementViews(postId);
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executor.shutdown();

        Post updatedPost = postRepository.findById(postId).orElseThrow();
        logger.info("For 50 concurrent users: " + updatedPost.getViews() + " views.");
        assertEquals(users, updatedPost.getViews());

        postRepository.deleteById(postId);
    }
}
