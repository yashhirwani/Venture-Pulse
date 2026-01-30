package com.codeblooded.Venturepulse.Service;

import com.codeblooded.Venturepulse.Models.users;
import com.codeblooded.Venturepulse.Repository.AuthRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthRepository repo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(AuthRepository repo) {
        this.repo = repo;
    }

    public void signup(users user) {
        // hash password before saving
        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
    }

    public users login(String email, String rawPassword) {
        users user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // never return password
        user.setPassword(null);
        return user;
    }
}
