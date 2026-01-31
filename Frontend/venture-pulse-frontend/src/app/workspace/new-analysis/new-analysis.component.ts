import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnalysisService } from '../analysis.service';

@Component({
  selector: 'app-new-analysis',
  templateUrl: './new-analysis.component.html',
  styleUrls: ['./new-analysis.component.css']
  // OR add `standalone: true` if you're using standalone components
})
export class NewAnalysisComponent {

  private getUserId(): number {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user;
  }
  analysisForm = {
    userId: this.getUserId(),
    ideaText: '',
    domain: '',
    targetUsers: '',
    pricingModel: '',
    teamInfo: ''
  };

  isSubmitting = false;

  constructor(
    private router: Router,
    private analysisService: AnalysisService
  ) {}

  startNeuralScan() {
    this.isSubmitting = true;
    console.log(this.analysisForm);
    this.analysisService.runNeuralAnalysis(this.analysisForm).subscribe({
      next: (report: any) => {
        this.isSubmitting = false;
          this.router.navigate(['/workspace/report', report.id]);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Scan failed:', err);
      }
    });
  }
}