package com.example.jutjubic.dto;

import com.example.jutjubic.model.Address;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationInfoDto {
    private String email;
    private String username;
    private String password;
    private String repeatPassword;
    private String name;
    private String lastname;
    private AddressDto address;
}
