package com.art.artyfrenzy.service;

import com.art.artyfrenzy.dto.AuthResponse;
import com.art.artyfrenzy.dto.LoginRequest;
import com.art.artyfrenzy.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}