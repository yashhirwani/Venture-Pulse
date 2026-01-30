package com.codeblooded.Venturepulse.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnalyzeRequestDTO {

    private String idea;
    private String domain;
    private double funding_total_usd;
    private int funding_rounds;
    private int years_since_founded;
    private int years_since_last_funding;

    // Getters and Setters
}
