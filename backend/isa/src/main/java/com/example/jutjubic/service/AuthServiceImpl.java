package com.example.jutjubic.service;

import com.example.jutjubic.dto.JwtAuthenticationRequest;
import com.example.jutjubic.dto.RegistrationInfoDto;
import com.example.jutjubic.dto.UserTokenState;
import com.example.jutjubic.exception.*;
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
        Optional<User> userOpt = userRepository.findByEmail(loginDto.getEmail());
        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid input. Please check the fields.");        }
        if(!userOpt.get().isEnabled()){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Your account is not verified yet.");
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userOpt.get().getUsername(),
                            loginDto.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtUtil.generateJwtToken(authentication);

            UserTokenState tokenDTO = new UserTokenState();
            tokenDTO.setAccessToken(jwt);
            tokenDTO.setExpiresIn(10000000L);

            return tokenDTO;

        } catch (BadCredentialsException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect credentials!");
        }
    }

    @Override
    public User register(RegistrationInfoDto registrationInfo) throws InterruptedException {
        if(userRepository.findByUsername(registrationInfo.getUsername()).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists: " + registrationInfo.getUsername());
        if (userRepository.findByEmail(registrationInfo.getEmail()).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists: " + registrationInfo.getEmail());

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