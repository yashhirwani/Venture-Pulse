package com.codeblooded.Venturepulse.Mapper;

import com.codeblooded.Venturepulse.Models.Report;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ReportRowMapper implements RowMapper<Report> {
    @Override
    public Report mapRow(ResultSet rs, int rowNum) throws SQLException {
        Report r = new Report();
        r.setId(rs.getLong("id"));
        r.setIdeaId(rs.getLong("idea_id"));
        r.setRiskScore(rs.getInt("risk_score"));
        r.setVerdict(rs.getString("verdict"));
        r.setCompetitors(rs.getString("competitors"));
        r.setRecommendations(rs.getString("recommendations"));
        return r;
    }
}
