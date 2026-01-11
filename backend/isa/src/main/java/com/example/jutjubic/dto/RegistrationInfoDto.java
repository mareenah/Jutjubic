package com.example.jutjubic.dto;

import com.example.jutjubic.model.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
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
public class RegistrationInfoDto {
    @NotBlank(message = "Enter your email.")
    @Email(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
            message = "Enter a valid email address.")
    private String email;

    @NotBlank(message = "Enter your username.")
    @Pattern(regexp = "^[\\p{L}][\\p{L}0-9._]{0,29}$",
            message = "Username must start with a letter and contain only letters, digits, dots or underscores.")
    @Size(min = 1, max = 30, message = "Username must be between 1 and 30 characters.")
    private String username;

    @NotBlank(message = "Enter your password.")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!?@#$%^&*><:;,.()]).{8,}$",
            message = "Password must contain uppercase, lowercase, number and special character.")
    @Size(min = 8, message = "Password must be at least 8 characters.")
    private String password;

    @NotBlank(message = "Re-enter your password.")
    @Size(min = 8, message = "Repeat password must be at least 8 characters.")
    private String repeatPassword;

    @NotBlank(message = "Enter your name.")
    @Pattern(regexp = "^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ' -]+$",
            message = "Only letters, hyphens, apostrophes and spaces allowed.")
    @Size(min = 1, max = 30, message = "Name must be between 1 and 30 characters.")
    private String name;

    @NotBlank(message = "Enter your lastname.")
    @Pattern(regexp = "^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ' -]+$",
            message = "Only letters, hyphens, apostrophes, and spaces allowed.")
    @Size(min = 1, max = 30, message = "Lastname must be between 1 and 30 characters.")
    private String lastname;

    @Valid
    private AddressDto address;
}
