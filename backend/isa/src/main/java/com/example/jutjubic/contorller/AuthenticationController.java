package com.example.jutjubic.contorller;

import com.example.jutjubic.dto.JwtAuthenticationRequest;
import com.example.jutjubic.dto.RegistrationInfoDto;
import com.example.jutjubic.dto.UserTokenState;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.model.User;
import com.example.jutjubic.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<UserTokenState> login(@Valid @RequestBody JwtAuthenticationRequest loginDto){
        return ResponseEntity.ok(authService.login(loginDto));
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@Valid @RequestBody RegistrationInfoDto registrationInfoDto) throws InterruptedException {
        return ResponseEntity.ok(authService.register(registrationInfoDto));
    }

    @GetMapping(value = "/verify", produces = "application/json")
    public Boolean verify(@RequestParam String verificationCode) {
        User verifiedUser = authService.verify(verificationCode);
        if(verifiedUser == null)
            throw new RuntimeException();
        return true;
    }

    @GetMapping(value="/user/{id}", produces = "application/json")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        return ResponseEntity.ok(authService.profile(id));
    }

    @GetMapping(produces = "application/json")
    public List<User> findAll() {
        return authService.findAll();
    }

}
