import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalysisService } from '../analysis.service';


@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.css']
})
export class ProcessingComponent implements OnInit {
  analysisId!: number;
  progress: number = 0;
  statusMessage: string = 'Initializing AI engine...';
  
  messages = [
    'Mapping industry landscape...',
    'Scraping competitor data points...',
    'Calculating risk variance...',
    'Analyzing market sentiment...',
    'Finalizing strategic recommendations...'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private analysisService: AnalysisService
  ) {}

  ngOnInit(): void {
    // Attempt to get ID from route, fallback to dummy for testing
    this.analysisId = +this.route.snapshot.params['id'] || 999;
    this.simulateProgress();
  }

  simulateProgress() {
    let messageIndex = 0;
    
    // Timer interval to simulate backend processing time
    const interval = setInterval(() => {
      // Increment progress by a random amount for a natural feel
      this.progress += Math.floor(Math.random() * 10) + 5;
      
      // Rotate messages based on progress thresholds
      if (this.progress >= (messageIndex + 1) * 20 && messageIndex < this.messages.length) {
        this.statusMessage = this.messages[messageIndex];
        messageIndex++;
      }

      // Completion Logic
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(interval);
        
        console.log('Dummy Processing Complete. Navigating to Mock Report...');
        
        setTimeout(() => {
          /* COMMENTED MAIN LOGIC: 
             this.router.navigate(['/workspace/report', this.analysisId]); 
          */

          // DUMMY LOGIC: Navigate to a static results page or alert for now
          // If you have created the report component, you can keep the navigate line above.
          this.router.navigate(['/workspace/report', this.analysisId]);
        }, 1000);
      }
    }, 400);
  }
}