package com.codeblooded.Venturepulse.Service;

import com.codeblooded.Venturepulse.Models.Idea;
import com.codeblooded.Venturepulse.Models.Report;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalysisService {

    private final JdbcTemplate jdbc;

    public AnalysisService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // Submit idea and generate report
    public Report submitIdea(Idea idea) {

        // 1. Save idea
        jdbc.update(
                "INSERT INTO ideas(user_id, idea_text, domain, target_users, pricing_model, team_info) VALUES (?, ?, ?, ?, ?, ?)",
                idea.getUserId(),
                idea.getIdeaText(),
                idea.getDomain(),
                idea.getTargetUsers(),
                idea.getPricingModel(),
                idea.getTeamInfo()
        );

        Long ideaId = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Long.class);

        // 2. Mock AI response (replace later with ML call)
        int riskScore = 72;
        String verdict = "High Risk";
        String competitors = "[{\"name\":\"StartupX\"},{\"name\":\"StartupY\"}]";
        String recommendations = "Validate market quickly and differentiate.";

        // 3. Save report
        jdbc.update(
                "INSERT INTO reports(idea_id, risk_score, verdict, competitors, recommendations) VALUES (?, ?, ?, ?, ?)",
                ideaId, riskScore, verdict, competitors, recommendations
        );

        // 4. Return report object
        Report r = new Report();
        r.setIdeaId(ideaId);
        r.setRiskScore(riskScore);
        r.setVerdict(verdict);
        r.setCompetitors(competitors);
        r.setRecommendations(recommendations);

        return r;
    }

    // Fetch history of reports by user
    public List<Report> getUserHistory(Long userId) {
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

    // Fetch single report by ID
    public Report getReportById(Long reportId) {
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
                reportId
        );
    }
}
