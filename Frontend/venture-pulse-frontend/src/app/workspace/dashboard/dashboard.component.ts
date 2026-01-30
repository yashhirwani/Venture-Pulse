import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading = true; 
  stats = { totalAnalyses: 0, averageRisk: 0, promisingIdeas: 0 };
  recentReports: any[] = [];

  ngOnInit(): void {
    // ⏳ Increased to 4.5 seconds to allow the Neural Engine messages to cycle
    setTimeout(() => {
      this.stats = { totalAnalyses: 24, averageRisk: 42, promisingIdeas: 12 };
      this.recentReports = [
        { id: 101, startupName: 'NexusFlow', verdict: 'PROMISING', createdAt: new Date() },
        { id: 102, startupName: 'Solaris IQ', verdict: 'RISKY', createdAt: new Date() }
      ];
      
      this.isLoading = false; 
    }, 4500); 
  }
}