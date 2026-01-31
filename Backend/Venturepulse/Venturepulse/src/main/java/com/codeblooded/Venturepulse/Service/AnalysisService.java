package com.codeblooded.Venturepulse.Service;

import com.codeblooded.Venturepulse.DTO.AnalyzeRequestDTO;
import com.codeblooded.Venturepulse.DTO.AnalyzeResponseDTO;
import com.codeblooded.Venturepulse.Models.Idea;
import com.codeblooded.Venturepulse.Models.Report;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import java.sql.PreparedStatement;

import java.util.List;
import java.util.Objects;

@Service
public class AnalysisService {

    private final JdbcTemplate jdbc;
    private final AiClientService aiClientService;

    public AnalysisService(JdbcTemplate jdbc, AiClientService aiClientService) {
        this.jdbc = jdbc;
        this.aiClientService = aiClientService;
    }

    public Report submitIdea(Idea idea) {

        // 1️⃣ INSERT IDEA (WITH GENERATED ID)
        KeyHolder ideaKeyHolder = new GeneratedKeyHolder();

        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO ideas(user_id, idea_text, domain, target_users, pricing_model, team_info,usp) VALUES (?, ?, ?, ?, ?, ?,?)",
                    new String[]{"id"}
            );
            ps.setLong(1, idea.getUserId());
            ps.setString(2, idea.getIdeaText());
            ps.setString(3, idea.getDomain());
            ps.setString(4, idea.getTargetUsers());
            ps.setString(5, idea.getPricingModel());
            ps.setString(6, idea.getTeamInfo());
            ps.setString(7,idea.getUsp());
            return ps;
        }, ideaKeyHolder);

        long ideaId = Objects.requireNonNull(ideaKeyHolder.getKey()).longValue(); // ✅ SAFE

        // 2️⃣ BUILD PYTHON REQUEST
        AnalyzeRequestDTO request = new AnalyzeRequestDTO();
        request.setIdea(idea.getIdeaText());
        request.setDomain(idea.getDomain());
        request.setFunding_total_usd(500000);
        request.setFunding_rounds(1);
        request.setYears_since_founded(1);
        request.setYears_since_last_funding(1);

        // 3️⃣ CALL PYTHON ML API
        AnalyzeResponseDTO response = aiClientService.analyzeStartup(request);

        double riskScore = response.getRiskScore();
        String verdict = response.getRiskLabel();
        String competitors = response.getSimilarStartups().toString();
        String recommendations = response.getExplanations().toString();
        String signals = response.getMarketSignals().toString();
        double uspScore = response.getUspScore();

        // 4️⃣ INSERT REPORT (WITH GENERATED ID)
        KeyHolder reportKeyHolder = new GeneratedKeyHolder();

        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO reports(idea_id, risk_score, verdict, competitors, recommendations, signals,usp_score) VALUES (?, ?, ?, ?, ?, ?,?)",
                    new String[]{"id"}
            );
            ps.setLong(1, ideaId);
            ps.setDouble(2, riskScore);
            ps.setString(3, verdict);
            ps.setString(4, competitors);
            ps.setString(5, recommendations);
            ps.setString(6, signals);
            ps.setDouble(7,uspScore);
            return ps;
        }, reportKeyHolder);

        Long reportId = Objects.requireNonNull(reportKeyHolder.getKey()).longValue(); // ✅ FIXED

        // 5️⃣ RETURN COMPLETE REPORT
        Report r = new Report();
        r.setId(reportId);          // ⭐ IMPORTANT
        r.setIdeaId(ideaId);
        r.setRiskScore(riskScore);
        r.setVerdict(verdict);
        r.setCompetitors(competitors);
        r.setRecommendations(recommendations);
        r.setMarketSignals(signals);
        r.setUspScore(uspScore);
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
                    r.setMarketSignals(rs.getString("signals"));
                    r.setUspScore(rs.getDouble("usp_score"));
                    return r;
                },
                userId
        );
    }

    // Fetch single report
    public Report getReportById(Long reportId) {
        return jdbc.queryForObject(
                "SELECT * FROM reports WHERE id = ?",
                (rs, rowNum) -> {
                    Report r = new Report();
                    r.setId(rs.getLong("id"));
                    r.setIdeaId(rs.getLong("idea_id"));
                    r.setRiskScore(rs.getDouble("risk_score"));
                    r.setVerdict(rs.getString("verdict"));
                    r.setCompetitors(rs.getString("competitors"));
                    r.setRecommendations(rs.getString("recommendations"));
                    r.setMarketSignals(rs.getString("signals"));
                    r.setUspScore(rs.getDouble("usp_score"));
                    return r;
                },
                reportId
        );
    }
}