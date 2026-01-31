import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalysisService } from '../analysis.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  isLoading = true;
  rawReport: any = null;
  
  // Parsed data objects
  competitors: any[] = [];
  marketSignals: any = {};
  recommendations: string[] = [];
  gaugeRotation: string = 'rotate(-90deg)';

  constructor(private route: ActivatedRoute, private analysisService: AnalysisService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.analysisService.getReportById(Number(id)).subscribe({
        next: (res) => {
          this.rawReport = res;
          this.parseReportData(res);
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    }
  }

  private parseReportData(data: any) {
    // 1. Parse Competitors String
    try {
      // Fix string format from backend (converting {key=val} to JSON style)
      const validJson = data.competitors.replace(/=/g, ':').replace(/([a-zA-Z0-9_]+):/g, '"$1":');
      this.competitors = JSON.parse(validJson);
    } catch (e) { this.competitors = []; }

    // 2. Parse Market Signals
    try {
      const signalsJson = data.marketSignals.replace(/=/g, ':').replace(/([a-zA-Z0-9_]+):/g, '"$1":');
      this.marketSignals = JSON.parse(signalsJson);
    } catch (e) { this.marketSignals = {}; }

    // 3. Set Visuals
    const score = (data.riskScore || 0) * 100;
    const rotationDegree = (score / 100) * 180 - 90;
    this.gaugeRotation = `rotate(${rotationDegree}deg)`;
  }
}