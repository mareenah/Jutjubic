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
    @Pattern(regexp = "^$|^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ\\s'-]+$",
            message = "Invalid country format.")
    @Size(max = 30, message = "Country must be below 30 characters.")
    private String country;

    @Pattern(regexp = "^$|^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ\\s'-]+$",
            message = "Invalid city format.")
    @Size(max = 30, message = "City must be below 30 characters.")
    private String city;

    @Pattern(regexp = "^$|^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-z0-9À-ÖØ-öø-ÿčćžđšČĆŽĐŠ\\s\\-\\/]+$",
            message = "Invalid street format.")
    @Size(max = 30, message = "Street must be below 30 characters.")
    private String street;
}
