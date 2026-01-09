package com.example.jutjubic.contorller;

import com.example.jutjubic.dto.JwtAuthenticationRequest;
import com.example.jutjubic.dto.RegistrationInfoDto;
import com.example.jutjubic.dto.UserTokenState;
import com.example.jutjubic.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<UserTokenState> login(@RequestBody JwtAuthenticationRequest loginDto){
        return ResponseEntity.ok(authService.login(loginDto));
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegistrationInfoDto registrationInfoDto) throws InterruptedException {
        return ResponseEntity.ok(authService.register(registrationInfoDto));
    }

    @GetMapping("/test")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> test(){
        return ResponseEntity.ok("Authentication works!");
    }

}
