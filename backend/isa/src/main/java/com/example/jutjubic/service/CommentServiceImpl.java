package com.example.jutjubic.service;

import com.example.jutjubic.dto.CommentDto;
import com.example.jutjubic.model.Comment;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.model.User;
import com.example.jutjubic.repository.CommentRepository;
import com.example.jutjubic.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.Optional;
import java.util.UUID;

@Service
public class CommentServiceImpl implements CommentService{

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    public Comment create(CommentDto commentDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You must be logged in to create a comment.");

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

    public List<Comment> findCommentsByPost(UUID postId) {
        return commentRepository
                .findAllByPostId(
                        postId,
                        Sort.by(Sort.Direction.DESC, "createdAt"));

    @Override
    public Page<Comment> findCommentsByPost(UUID postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return commentRepository.findAllByPostId(postId, pageable);
    }

}
