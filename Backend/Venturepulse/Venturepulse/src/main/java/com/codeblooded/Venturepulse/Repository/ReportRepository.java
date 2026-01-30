package com.codeblooded.Venturepulse.Repository;

import com.codeblooded.Venturepulse.Models.Report;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ReportRepository {

    private final JdbcTemplate jdbc;

    public ReportRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void save(Report r) {
        jdbc.update(
                "INSERT INTO reports(idea_id, risk_score, verdict, competitors, recommendations) VALUES (?, ?, ?, ?, ?)",
                r.getIdeaId(),
                r.getRiskScore(),
                r.getVerdict(),
                r.getCompetitors(),
                r.getRecommendations()
        );
    }

    public List<Report> findHistoryByUser(Long userId) {
        return jdbc.query(
                """
                SELECT r.*
                FROM reports r
                JOIN ideas i ON r.idea_id = i.id
                WHERE i.user_id = ?
                ORDER BY r.id DESC
                """,
                (rs, rowNum) -> {
                    Report r = new Report();
                    r.setId(rs.getLong("id"));
                    r.setIdeaId(rs.getLong("idea_id"));
                    r.setRiskScore(rs.getInt("risk_score"));
                    r.setVerdict(rs.getString("verdict"));
                    r.setCompetitors(rs.getString("competitors"));
                    r.setRecommendations(rs.getString("recommendations"));
                    return r;
                },
                userId
        );
    }

    public Report findById(Long id) {
        return jdbc.queryForObject(
                "SELECT * FROM reports WHERE id = ?",
                (rs, rowNum) -> {
                    Report r = new Report();
                    r.setId(rs.getLong("id"));
                    r.setIdeaId(rs.getLong("idea_id"));
                    r.setRiskScore(rs.getInt("risk_score"));
                    r.setVerdict(rs.getString("verdict"));
                    r.setCompetitors(rs.getString("competitors"));
                    r.setRecommendations(rs.getString("recommendations"));
                    return r;
                },
                id
        );
    }
}
