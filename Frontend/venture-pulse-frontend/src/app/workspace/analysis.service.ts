import { Injectable } from '@angular/core';
import { of, Observable, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  // Mock data for your Analysis Vault
  private mockVaultData = [
    { id: '101', startup: 'NexusFlow AI', domain: 'SaaS', verdict: 'PROMISING', risk: 28, date: new Date() },
    { id: '102', startup: 'Solaris IQ', domain: 'CleanTech', verdict: 'RISKY', risk: 64, date: new Date() },
    { id: '103', startup: 'Aura Health', domain: 'HealthTech', verdict: 'PROMISING', risk: 32, date: new Date() }
  ];

  constructor() {}

  // 🚀 THIS FIXES TS2339
  getHistory(): Observable<any[]> {
    return of(this.mockVaultData).pipe(delay(2000));
  }

  // Keep this here so your New Analysis page doesn't break again
  runNeuralAnalysis(formData: any): Observable<any> {
    return of({ id: '101', ...formData }).pipe(delay(4500));
  }


// Add this to your AnalysisService class
deleteReport(id: string): Observable<boolean> {
  // Filter out the item with the matching ID
  this.mockVaultData = this.mockVaultData.filter(item => item.id !== id);
  
  // Return a success signal after a small delay
  return of(true).pipe(delay(500));
}

}