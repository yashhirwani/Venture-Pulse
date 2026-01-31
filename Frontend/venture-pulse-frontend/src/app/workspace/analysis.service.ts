import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {


  private BASE_URL = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // 🔹 1. Submit a new startup idea (AI Analysis)
  runNeuralAnalysis(formData: any): Observable<any> {
    return this.http.post(
      `${this.BASE_URL}/analysis/submit`,
      formData
    );
  }

  // 🔹 2. Get history of reports for a user
  getHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.BASE_URL}/analysis/history/${userId}`
    );
  }

  // 🔹 3. Get a single report by ID
  getReportById(reportId: number): Observable<any> {
    return this.http.get(
      `${this.BASE_URL}/analysis/report/${reportId}`
    );
  }

  // 🔹 4. Delete a report
  deleteReport(reportId: number): Observable<any> {
    return this.http.delete(
      `${this.BASE_URL}/analysis/${reportId}`
    );
  }
}
