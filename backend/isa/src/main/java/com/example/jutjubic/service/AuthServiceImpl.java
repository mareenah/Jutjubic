package com.example.jutjubic.service;

import com.example.jutjubic.dto.JwtAuthenticationRequest;
import com.example.jutjubic.dto.RegistrationInfoDto;
import com.example.jutjubic.dto.UserTokenState;
import com.example.jutjubic.exception.UsernameAlreadyExistsException;
import com.example.jutjubic.model.Address;
import com.example.jutjubic.model.User;
import com.example.jutjubic.repository.UserRepository;
import com.example.jutjubic.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public UserTokenState login(JwtAuthenticationRequest loginDto) {
        Optional<User> userOpt = userRepository.findByUsername(loginDto.getUsername());
        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "message: Incorrect credentials!");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateJwtToken(authentication);

        UserTokenState tokenDTO = new UserTokenState();
        tokenDTO.setAccessToken(jwt);
        tokenDTO.setExpiresIn(10000000L);

        return tokenDTO;
    }

    public User register(RegistrationInfoDto registrationInfo){

        if(userRepository.findByUsername(registrationInfo.getUsername()).isPresent())
            throw new UsernameAlreadyExistsException("Username already exists: " + registrationInfo.getUsername());

        Address a = new Address();
        a.setCountry(registrationInfo.getAddress().getCountry());
        a.setCity(registrationInfo.getAddress().getCity());
        a.setStreet(registrationInfo.getAddress().getStreet());

        User u = new User();
        u.setEmail(registrationInfo.getEmail());
        u.setUsername(registrationInfo.getUsername());
        u.setPassword(passwordEncoder.encode(registrationInfo.getPassword()));
        u.setName(registrationInfo.getName());
        u.setLastname(registrationInfo.getLastname());
        u.setAddress(a);

        return userRepository.save(u);
    }

}