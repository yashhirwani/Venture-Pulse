package com.codeblooded.Venturepulse.Models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Report {
    private Long id;
    private Long ideaId;
    private double riskScore;
    private String verdict;
    private String competitors;
    private String recommendations;
    private String marketSignals;
}
