import { Component, OnInit } from '@angular/core';
import { AnalysisService } from '../analysis.service';

interface HistoryItem {
  id: string;
  startup: string;
  domain: string;
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

  ngOnInit(): void {
    this.analysisService.getHistory().subscribe(data => {
      this.historyItems = data.map((item: any) => ({
        id: item.id,
        startup: item.startup || item.startup_name || '—',
        domain: item.domain || item.industry || '—',
        verdict: item.verdict,
        risk: item.risk || item.risk_score || 0,
        date: item.date || item.created_at
      }));

      this.filteredItems = this.historyItems;
      this.isLoading = false;
    });
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredItems = this.historyItems.filter(item =>
      item.startup.toLowerCase().includes(q)
    );
  }

  // Add this function to your HistoryComponent class
removeAnalysis(id: string): void {
  if (confirm('Are you sure you want to delete this intelligence brief?')) {
    this.analysisService.deleteReport(id).subscribe(() => {
      // Update the UI by removing the item from the local arrays
      this.historyItems = this.historyItems.filter(item => item.id !== id);
      this.onSearch(); // Refresh the filtered list
    });
  }
}
}
