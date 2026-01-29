package com.codeblooded.Venturepulse.Service;

import com.codeblooded.Venturepulse.Models.users;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final JdbcTemplate jdbc;

    public AuthService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // Signup
    public void signup(users user) {
        jdbc.update(
                "INSERT INTO users(name, email, password) VALUES (?, ?, ?)",
                user.getName(),
                user.getEmail(),
                user.getPassword()
        );
    }

    // Login
    public users login(String email, String password) {
        return jdbc.queryForObject(
                "SELECT * FROM users WHERE email = ? AND password = ?",
                (rs, rowNum) -> {
                    users u = new users();
                    u.setId(rs.getLong("id"));
                    u.setName(rs.getString("name"));
                    u.setEmail(rs.getString("email"));
                    return u;
                },
                email, password
        );
    }
}

