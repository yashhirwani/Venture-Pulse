import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
// shared/loader/loader.component.ts
export class LoaderComponent implements OnInit, OnDestroy {
  loadingMessage = 'Initializing Neural Engine...';
  private messages = [
    'Scanning Market Dynamics...',
    'Identifying Incumbent Threats...',
    'Calculating Risk Vectors...',
    'Generating Strategic Roadmap...',
    'Finalizing Intelligence Brief...'
  ];
  private interval: any;

  ngOnInit() {
    let i = 0;
    // ⚡ Rotate messages every 900ms for a "high-speed" processing feel
    this.interval = setInterval(() => {
      if (i < this.messages.length) {
        this.loadingMessage = this.messages[i];
        i++;
      }
    }, 900);
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }
}