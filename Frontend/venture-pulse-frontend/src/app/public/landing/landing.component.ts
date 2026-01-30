import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  heroChartData: number[] = [65, 75, 70, 88, 84, 94];
  private intervalId: any;

  ngOnInit(): void {
    // Keeps the visual feed "moving"
    this.intervalId = setInterval(() => {
      const last = this.heroChartData[this.heroChartData.length - 1];
      const next = Math.min(Math.max(last + (Math.random() * 6 - 3), 85), 98);
      this.heroChartData = [...this.heroChartData.slice(1), Math.round(next)];
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}