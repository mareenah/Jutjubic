package com.example.jutjubic.model;

import com.example.jutjubic.converter.StringListJsonConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comments",
        indexes = {
                @Index(name = "idx_comment_post_created", columnList = "post_id, created_at"),
                @Index(name = "idx_comment_user_created", columnList = "user_id, created_at")
        })
public class Comment {
    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "text", columnDefinition = "TEXT")
    private String text;

    @Column(name = "createdAt", nullable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", referencedColumnName = "id")
    private Post post;
}
