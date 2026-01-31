package com.codeblooded.Venturepulse.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class AnalyzeResponseDTO {

    @JsonProperty("risk_final")
    private double riskScore;

    @JsonProperty("risk_label")
    private String riskLabel;

    @JsonProperty("similar_startups")
    private List<Map<String, Object>> similarStartups;

    @JsonProperty("market_signals")
    private Map<String, Object> marketSignals;

    @JsonProperty("launch_timing")
    private Map<String, Object> launchTiming;

    @JsonProperty("explanations")
    private List<String> explanations;

    @JsonProperty("usp_uniqueness_score")
    private double uspScore;


    // Getters and Setters
}