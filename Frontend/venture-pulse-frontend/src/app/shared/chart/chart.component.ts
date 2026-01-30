import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  // Array of numbers (e.g., [10, 45, 30, 80, 60]) representing a trend
  @Input() data: number[] = [20, 40, 35, 70, 55, 90]; 
  @Input() color: string = '#6366f1'; // Default Indigo
  
  points: string = '';

  constructor() {}

  ngOnInit(): void {
    this.generatePoints();
  }

  generatePoints() {
    // Map data to SVG coordinates (width: 200, height: 60)
    const max = Math.max(...this.data);
    const step = 200 / (this.data.length - 1);
    
    this.points = this.data
      .map((val, i) => {
        const x = i * step;
        const y = 60 - (val / max) * 50; // Inverted Y-axis with padding
        return `${x},${y}`;
      })
      .join(' ');
  }
}