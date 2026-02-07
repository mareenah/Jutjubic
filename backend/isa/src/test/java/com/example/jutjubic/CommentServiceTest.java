package com.example.jutjubic;

import com.example.jutjubic.repository.CommentRepository;
import com.example.jutjubic.service.CommentServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @InjectMocks
    private CommentServiceImpl commentService;

    @Mock
    private CommentRepository commentRepository;

    @Test
    void shouldBlockAfter60CommentsPerHour() {
        UUID userId = UUID.randomUUID();

        when(commentRepository.countUserCommentsSince(eq(userId), any(Instant.class)))
                .thenReturn(59L);

        commentService.validateRateLimit(userId);
        System.out.println("60th comment allowed.");

        when(commentRepository.countUserCommentsSince(eq(userId), any(Instant.class)))
                .thenReturn(60L);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> commentService.validateRateLimit(userId));

        System.out.println("61st comment blocked." +
                "\nStatus: " + ex.getStatusCode() +
                "\nReason: " + ex.getReason());

        assertEquals(429, ex.getStatusCode().value());
    }
}
