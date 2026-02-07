package com.example.jutjubic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CommentDto {
    @Size(min = 1, max = 500, message = "Comment must be 1-500 characters")
    @NotBlank(message = "Comment text cannot be empty")
    private String text;
    private String userId;
    private String postId;
}
