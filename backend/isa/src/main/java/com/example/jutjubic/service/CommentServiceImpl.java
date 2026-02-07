package com.example.jutjubic.service;

import com.example.jutjubic.dto.CommentDto;
import com.example.jutjubic.model.Comment;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.model.User;
import com.example.jutjubic.repository.CommentRepository;
import com.example.jutjubic.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class CommentServiceImpl implements CommentService{

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    @CacheEvict(value = "comments", key = "#comment.post.id + '*'", allEntries = true)
    public Comment create(CommentDto commentDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Da bi komentarisao objavu, prijavi se.");

        validateRateLimit(UUID.fromString(commentDto.getUserId()));

        Comment comment = new Comment();
        comment.setText(commentDto.getText());
        comment.setCreatedAt(Instant.now());
        Optional<Post> postOpt = postRepository.findById(UUID.fromString(commentDto.getPostId()));
        Post post = postOpt.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        comment.setPost(post);
        User user = (User) auth.getPrincipal();
        comment.setUser(user);
        return commentRepository.save(comment);
    }

    @Override
    @Cacheable(value = "comments", key = "#postId + ':' + #page + ':' + #size")
    public Page<Comment> findCommentsByPost(UUID postId, int page, int size) {
        log.info("Loading comments from disk for post: {}", postId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return commentRepository.findAllByPostId(postId, pageable);
    }

    @Override
    public void validateRateLimit(UUID userId) {
        Instant oneHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
        long count = commentRepository.countUserCommentsSince(userId, oneHourAgo);
        if (count >= 60)
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Dozvoljeno maksimalno 60 komentara po satu.");
    }
}
