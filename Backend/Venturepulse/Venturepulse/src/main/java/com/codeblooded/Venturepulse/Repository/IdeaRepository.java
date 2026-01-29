package com.codeblooded.Venturepulse.Repository;
import com.codeblooded.Venturepulse.Models.Idea;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class IdeaRepository {

    private final JdbcTemplate jdbc;

    public IdeaRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Long save(Idea idea) {
        jdbc.update(
                "INSERT INTO ideas(user_id, idea_text, domain, target_users, pricing_model, team_info) VALUES (?, ?, ?, ?, ?, ?)",
                idea.getUserId(),
                idea.getIdeaText(),
                idea.getDomain(),
                idea.getTargetUsers(),
                idea.getPricingModel(),
                idea.getTeamInfo()
        );

        return jdbc.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
    }
}