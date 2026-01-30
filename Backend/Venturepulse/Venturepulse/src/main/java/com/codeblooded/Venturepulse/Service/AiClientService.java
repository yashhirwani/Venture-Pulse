package com.codeblooded.Venturepulse.Service;

import com.codeblooded.Venturepulse.DTO.AnalyzeRequestDTO;
import com.codeblooded.Venturepulse.DTO.AnalyzeResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AiClientService {

    private final WebClient webClient;

    public AiClientService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("http://localhost:8082")
                .build();
    }

    public AnalyzeResponseDTO analyzeStartup(AnalyzeRequestDTO request) {
        return webClient.post()
                .uri("/analyze")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AnalyzeResponseDTO.class)
                .block();
    }
}