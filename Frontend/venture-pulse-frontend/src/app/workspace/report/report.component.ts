
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  isLoading = false;
  gaugeRotation = 'rotate(0deg)'; // Start at 0 for animation

  // Mock data structure matching your merged template
  report: any = {
    title: 'VenturePulse AI',
    verdict: 'PROMISING', // Use uppercase to match CSS: PROMISING, RISKY, AVOID
    risk: { score: 74, level: 'Medium', rotation: 0 },
    market: { maturity: 'Emerging', demand: 'Upward (Strong)', potential: '8.2/10' },
    incumbentAlerts: [],
    recommendations: [
      'Focus on niche B2B automation before scaling to consumer markets.',
      'Secure intellectual property for the core processing algorithm.',
      'Establish a partnership with cloud infrastructure providers early.'
    ],
    timestamp: new Date()
  };

  ngOnInit(): void {
    // Trigger animation after a slight delay
    setTimeout(() => {
      const angle = (this.report.risk.score / 100) * 180;
      this.gaugeRotation = `rotate(${angle}deg)`;
      this.report.risk.rotation = angle;
    }, 300);
  }
}