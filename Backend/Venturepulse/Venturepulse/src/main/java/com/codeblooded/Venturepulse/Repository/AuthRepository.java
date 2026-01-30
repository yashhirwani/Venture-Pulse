package com.codeblooded.Venturepulse.Repository;

import com.codeblooded.Venturepulse.Models.users;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class AuthRepository {

    private final JdbcTemplate jdbc;

    public AuthRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Optional<users> findByEmail(String email) {
        try {
            return Optional.ofNullable(
                    jdbc.queryForObject(
                            "SELECT * FROM users WHERE email = ?",
                            (rs, rowNum) -> {
                                users u = new users();
                                u.setId(rs.getLong("id"));
                                u.setName(rs.getString("name"));
                                u.setEmail(rs.getString("email"));
                                u.setPassword(rs.getString("password"));
                                return u;
                            },
                            email
                    )
            );
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void save(users user) {
        jdbc.update(
                "INSERT INTO users(name, email, password) VALUES (?, ?, ?)",
                user.getName(),
                user.getEmail(),
                user.getPassword()
        );
    }
}
