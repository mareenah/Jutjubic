package com.example.jutjubic.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.parameters.P;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    @NotBlank(message = "Enter video title.")
    @Pattern(regexp ="^[\\p{L}\\p{N} .,'\"!?:()-]{2,50}$",
            message = "Title allows latin and cyrillic letters, numbers, spaces and basic punctuation (optional) from 2 to 50 characters.")
    private String title;

    @NotBlank(message = "Enter video description.")
    @Pattern(regexp ="^[\\p{L}\\p{N}\\s.,'\"!?():;\\-–—_/+#@%\\n\\r]{5,2000}$",
            message = "Description allows latin and cyrillic letters, numbers, spaces and tabs, new lines, common punctuation from 5 to 2000 characters.")
    private String description;

    private List<@NotBlank String> tags;

    private MultipartFile thumbnail;

    private MultipartFile video;

    @Pattern(regexp = "^$|^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ\\s'-]+$",
            message = "Invalid country format.")
    @Size(max = 30, message = "Country must be below 30 characters.")
    private String country;

    @Pattern(regexp = "^$|^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ\\s'-]+$",
            message = "Invalid city format.")
    @Size(max = 30, message = "City must be below 30 characters.")
    private String city;

}
