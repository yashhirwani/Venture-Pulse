import { Component, OnInit } from '@angular/core';
import { AnalysisService } from '../analysis.service';

interface HistoryItem {
  id: string;
  ideaText: string;
  domain: string;
  targetUsers: string;
  verdict: 'PROMISING' | 'RISKY' | 'AVOID';
  risk: number;
  date: string;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  isLoading = true;
  searchQuery = '';
  historyItems: HistoryItem[] = [];
  filteredItems: HistoryItem[] = [];

  constructor(private analysisService: AnalysisService) {}

  private getUserId(): number {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user;
  }
  ngOnInit(): void {
  
  
  this.analysisService.getHistory(this.getUserId()).subscribe({
    next: (data: any[]) => {
      this.historyItems = data.map((item: any) => ({
        id: item.id,
        ideaText: item.ideaText || '—',
        domain: item.domain || '—',
        targetUsers: item.targetUsers || '—',
        verdict: item.verdict || 'RISKY',
        risk: item.riskScore || 0,
        date: item.createdAt || new Date()
      }));
      this.filteredItems = this.historyItems;
      this.isLoading = false;
    },
    error: () => this.isLoading = false
  });
}

removeAnalysis(id: string): void {
  if (confirm('Permanently delete this intelligence brief?')) {
    // Convert string ID to number if your backend requires it
    const reportId = Number(id); 
    this.analysisService.deleteReport(reportId).subscribe(() => {
      this.historyItems = this.historyItems.filter(item => item.id !== id);
      this.onSearch();
    });
  }
}

  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredItems = this.historyItems.filter(item =>
      item.ideaText.toLowerCase().includes(q) || item.domain.toLowerCase().includes(q)
    );
  }

  
}