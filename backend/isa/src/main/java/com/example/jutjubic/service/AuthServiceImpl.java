package com.example.jutjubic.service;

import com.example.jutjubic.dto.JwtAuthenticationRequest;
import com.example.jutjubic.dto.RegistrationInfoDto;
import com.example.jutjubic.dto.UserTokenState;
import com.example.jutjubic.exception.*;
import com.example.jutjubic.model.Address;
import com.example.jutjubic.model.User;
import com.example.jutjubic.repository.UserRepository;
import com.example.jutjubic.security.JwtUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

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

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private Environment env;

    private final static Duration VERIFICATION_LINK_EXPIRY_DURATION = Duration.ofHours(24);

    @Override
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
        u.setVerificationCode(UUID.randomUUID().toString().replaceAll("-", ""));
        u.setEnabled(false);
        u.setCodeCreatedAt(LocalDateTime.now());

        sendVerificationEmail(u);
        return userRepository.save(u);
    }

    private void sendVerificationEmail(User user) throws InterruptedException {
        String content = "Dear [[name]],<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + "ISA team.";
        String verificationLink = "http://localhost:4200/verify/" + user.getVerificationCode();

        //Simulacija duze aktivnosti
        Thread.sleep(6000);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        try {
            helper.setTo(user.getEmail());
            helper.setFrom(env.getProperty("spring.mail.username"));
            helper.setSubject("Please verify your registration");

            content = content.replace("[[name]]", user.getUsername());
            content = content.replace("[[URL]]", verificationLink);

            helper.setText(content, true);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        mailSender.send(message);
        System.out.println("Email sent!");
    }
}