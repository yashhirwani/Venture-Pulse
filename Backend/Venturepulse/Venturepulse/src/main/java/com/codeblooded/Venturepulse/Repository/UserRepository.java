package com.codeblooded.Venturepulse.Repository;

import com.codeblooded.Venturepulse.Models.users;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void save(users user) {
        jdbc.update(
                "INSERT INTO users(name, email, password) VALUES (?, ?, ?)",
                user.getName(),
                user.getEmail(),
                user.getPassword()
        );
    }

    public users findByEmailAndPassword(String email, String password) {
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
