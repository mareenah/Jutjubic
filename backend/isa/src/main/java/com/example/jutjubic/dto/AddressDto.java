package com.example.jutjubic.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
    @NotBlank(message = "Enter your country.")
    @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ\\s'-]+$",
            message = "Invalid country format.")
    @Size(min = 1, max = 30, message = "Country must be between 1 and 30 characters.")
    private String country;

    @NotBlank(message = "Enter your city.")
    @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ\\s'-]+$",
            message = "Invalid city format.")
    @Size(min = 1, max = 30, message = "City must be between 1 and 30 characters.")
    private String city;

    @NotBlank(message = "Enter your street.")
    @Pattern(regexp = "^[A-Za-z0-9À-ÖØ-öø-ÿčćžđšČĆŽĐŠ\\s\\-\\\\/]+$",
            message = "Invalid street format.")
    @Size(min = 1, max = 30, message = "Street must be between 1 and 30 characters.")
    private String street;
}
