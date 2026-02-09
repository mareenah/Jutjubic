package com.example.jutjubic.service;

import com.example.jutjubic.dto.JwtAuthenticationRequest;
import com.example.jutjubic.dto.RegistrationInfoDto;
import com.example.jutjubic.dto.UserTokenState;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.model.User;

import java.util.List;

public interface AuthService {
    UserTokenState login(JwtAuthenticationRequest loginDto);
    User register(RegistrationInfoDto registrationInfo) throws InterruptedException;
    User verify (String verificationCode);
    User profile (String id);
    List<User> findAll();

}
