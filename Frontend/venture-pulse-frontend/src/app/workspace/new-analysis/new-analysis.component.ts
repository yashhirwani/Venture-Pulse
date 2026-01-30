import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnalysisService } from '../analysis.service';

@Component({
  selector: 'app-new-analysis',
  templateUrl: './new-analysis.component.html',
  styleUrls: ['./new-analysis.component.css']
})
export class NewAnalysisComponent {

  
  
  // Model for the venture input
  analysisForm = {
    startupName: '',
    industry: '',
    description: '',
    targetMarket: 'Global'
  };

  isSubmitting = false;

  constructor(private router: Router, private analysisService: AnalysisService) {}

// src/app/workspace/new-analysis/new-analysis.component.ts

startNeuralScan() {
  this.isSubmitting = true;

  // Added explicit type ': any' to the report parameter to satisfy TS7006
  this.analysisService.runNeuralAnalysis(this.analysisForm).subscribe((report: any) => {
    this.isSubmitting = false;
    
    // Ensure the ID exists before navigating
    if (report && report.id) {
      this.router.navigate(['/workspace/report', report.id]);
    }
  });
}
}
