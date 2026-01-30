package com.codeblooded.Venturepulse.Mapper;

import com.codeblooded.Venturepulse.Models.Idea;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class IdeaRowMapper implements RowMapper<Idea> {
    @Override
    public Idea mapRow(ResultSet rs, int rowNum) throws SQLException {
        Idea i = new Idea();
        i.setId(rs.getLong("id"));
        i.setUserId(rs.getLong("user_id"));
        i.setIdeaText(rs.getString("idea_text"));
        i.setDomain(rs.getString("domain"));
        i.setTargetUsers(rs.getString("target_users"));
        i.setPricingModel(rs.getString("pricing_model"));
        i.setTeamInfo(rs.getString("team_info"));
        return i;
    }
}