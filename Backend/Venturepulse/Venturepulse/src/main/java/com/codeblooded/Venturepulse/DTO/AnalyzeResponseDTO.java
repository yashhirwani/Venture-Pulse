package com.codeblooded.Venturepulse.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class AnalyzeResponseDTO {

    private double risk_score;
    private String risk_label;
    private List<Map<String, Object>> similar_startups;
    private Map<String, Object> market_signals;
    private Map<String, Object> launch_timing;
    private List<String> explanations;

    // Getters and Setters
}