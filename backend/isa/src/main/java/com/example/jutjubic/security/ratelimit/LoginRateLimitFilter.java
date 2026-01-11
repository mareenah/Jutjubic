package com.example.jutjubic.security.ratelimit;


import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.*;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if ("/api/auth/login".equals(request.getServletPath())
                && "POST".equalsIgnoreCase(request.getMethod())) {

            String ip = getClientIP(request);
            Bucket bucket = buckets.computeIfAbsent(ip, this::createNewBucket);

            if (!bucket.tryConsume(1)) {
                sendTooManyRequests(response);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private Bucket createNewBucket(String ip) {
        return Bucket.builder()
                .addLimit(
                        Bandwidth.classic(
                                5,
                                Refill.intervally(5, Duration.ofMinutes(1))
                        )
                )
                .build();
    }

    private String getClientIP(HttpServletRequest request) {
        return request.getRemoteAddr();
    }

    private void sendTooManyRequests(HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> body = Map.of(
                "status", 429,
                "error", "Too Many Requests",
                "message", "Too many login attempts. Try again in 1 minute."
        );

        new ObjectMapper().writeValue(response.getOutputStream(), body);
    }
}
