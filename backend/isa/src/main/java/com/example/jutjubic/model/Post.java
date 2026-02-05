package com.example.jutjubic.model;

import com.example.jutjubic.converter.StringListJsonConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "title")
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "tags", columnDefinition = "json")
    @Convert(converter = StringListJsonConverter.class)
    private List<String> tags;

    @Column(name = "thumbnailUrl")
    private String thumbnail;

    @Column(name = "videoPath")
    private String video;

    @Column(name = "createdAt")
    private Instant createdAt;

    @Column(name = "country")
    private String country;

    @Column(name = "city")
    private String city;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
