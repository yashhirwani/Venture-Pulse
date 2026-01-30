import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  // Navigation items matching your Workspace structure
  navItems = [
    { label: 'Dashboard', route: '/workspace/dashboard', icon: '⊞' },
    { label: 'New Analysis', route: '/workspace/new-analysis', icon: '⊕' },
    { label: 'Analysis Vault', route: '/workspace/history', icon: '🗠' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  logout() {
    // Clear auth and redirect
    console.log('Logging out user...');
    this.router.navigate(['/auth/login']);
  }
}