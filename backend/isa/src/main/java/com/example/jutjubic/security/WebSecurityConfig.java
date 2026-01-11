package com.example.jutjubic.security;

import com.example.jutjubic.security.ratelimit.LoginRateLimitFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.ExceptionHandlingConfigurer;
import org.springframework.security.config.annotation.web.configurers.SessionManagementConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends GlobalMethodSecurityConfiguration {
    private final LoginRateLimitFilter loginRateLimitFilter;

    @Autowired
    CustomUserDetailsService userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    public WebSecurityConfig(LoginRateLimitFilter loginRateLimitFilter) {
        this.loginRateLimitFilter = loginRateLimitFilter;
    }

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public AuthenticationManager authenticationManagerBean(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(getCsrfConfig())
                .exceptionHandling(getExceptionHandlingConfig())
                .sessionManagement(getSessionManagementConfig())
                .authorizeHttpRequests((requests) -> {
                    requests.requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/verify", "/api/auth/test").permitAll(); // TODO
                    requests.anyRequest().authenticated();
                });

        http.addFilterBefore(loginRateLimitFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private Customizer<CsrfConfigurer<HttpSecurity>> getCsrfConfig(){
        return AbstractHttpConfigurer::disable;
    }

    private Customizer<ExceptionHandlingConfigurer<HttpSecurity>> getExceptionHandlingConfig(){
        return httpSecurityExceptionHandlingConfigurer -> httpSecurityExceptionHandlingConfigurer.authenticationEntryPoint(unauthorizedHandler);
    }

    private Customizer<SessionManagementConfigurer<HttpSecurity>> getSessionManagementConfig(){
        return httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

}