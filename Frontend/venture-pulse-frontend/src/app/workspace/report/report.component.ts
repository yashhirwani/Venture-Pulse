import { Component, OnInit } from '@angular/core';
import { AnalysisService } from '../analysis.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  isLoading = true;
  report: any = null; // Initialize as null to show loader
  gaugeRotation = 'rotate(0deg)';

  constructor(
    private analysisService: AnalysisService, 
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      // Convert route ID to number to match your service signature
      this.analysisService.getReportById(Number(id)).subscribe({
        next: (data) => {
          this.report = data;
          this.calculateVisuals();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching report:', err);
          this.isLoading = false;
        }
      });
    }
  }

  private calculateVisuals() {
    if (this.report && this.report.riskScore) {
      // Logic: 0 score = -90deg, 100 score = 90deg
      const rotationDegree = (this.report.riskScore / 100) * 180 - 90;
      this.gaugeRotation = `rotate(${rotationDegree}deg)`;
    }
  }
}