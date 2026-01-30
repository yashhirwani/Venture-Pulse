import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-big-player-alerts',
  templateUrl: './big-player-alerts.component.html',
  styleUrls: ['./big-player-alerts.component.css']
})
export class BigPlayerAlertsComponent implements OnInit {
  // Input allows the parent 'report' component to pass specific data
  @Input() alerts: any[] = []; 

  constructor() {}

  ngOnInit(): void {
    // Mock data if no input is provided
    if (this.alerts.length === 0) {
      this.alerts = [
        { name: 'Google', product: 'Vertex AI', threat: 'High', details: 'Direct API overlap with core feature set.' },
        { name: 'Adobe', product: 'Firefly', threat: 'Medium', details: 'Expanding into similar creative generative workflows.' },
        { name: 'Microsoft', product: 'Azure AI', threat: 'Low', details: 'General infrastructure play; no specific niche overlap yet.' }
      ];
    }
  }
}