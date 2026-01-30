package com.codeblooded.Venturepulse.Mapper;



import com.codeblooded.Venturepulse.Models.users;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRowMapper implements RowMapper<users> {
    @Override
    public users mapRow(ResultSet rs, int rowNum) throws SQLException {
        users u = new users();
        u.setId(rs.getLong("id"));
        u.setName(rs.getString("name"));
        u.setEmail(rs.getString("email"));
        u.setPassword(rs.getString("password"));
        return u;
    }
}