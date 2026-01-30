import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showProfileMenu = false;
  // Current date for the investor brief context
  today: number = Date.now();

  constructor() {}

  ngOnInit(): void {}

  toggleProfile() {
    this.showProfileMenu = !this.showProfileMenu;
  }
}