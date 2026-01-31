import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showProfileMenu = false;
  today: number = Date.now();

  constructor() {}

  ngOnInit(): void {}

  /**
   * Toggles the dropdown menu visibility.
   * StopPropagation ensures the window listener doesn't immediately close it.
   */
  toggleProfile(event: Event) {
    event.stopPropagation();
    this.showProfileMenu = !this.showProfileMenu;
  }

  /**
   * Listen for clicks outside the profile area to close the dropdown.
   */
  @HostListener('window:click')
  closeMenu() {
    this.showProfileMenu = false;
  }

  logout() {
    console.log('Logging out...');
    // Add your authService.logout() logic here
  }
}