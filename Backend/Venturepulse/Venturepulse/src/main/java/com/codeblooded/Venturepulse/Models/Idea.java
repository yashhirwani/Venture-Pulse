package com.codeblooded.Venturepulse.Models;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Idea {
        private Long id;
        private Long userId;
        private String ideaText;
        private String domain;
        private String targetUsers;
        private String pricingModel;
        private String teamInfo;
    }

