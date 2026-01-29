package com.codeblooded.Venturepulse.Controller;

import com.codeblooded.Venturepulse.Models.Idea;
import com.codeblooded.Venturepulse.Models.Report;
import com.codeblooded.Venturepulse.Service.AnalysisService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin
public class AnalysisController {

    private final AnalysisService service;

    public AnalysisController(AnalysisService service) {
        this.service = service;
    }

    // Submit idea
    @PostMapping("/submit")
    public Report submit(@RequestBody Idea idea) {
        return service.submitIdea(idea);
    }

    // Get report history
    @GetMapping("/history/{userId}")
    public List<Report> history(@PathVariable Long userId) {
        return service.getUserHistory(userId);
    }

    // Get single report
    @GetMapping("/{reportId}")
    public Report getReport(@PathVariable Long reportId) {
        return service.getReportById(reportId);
    }
}
