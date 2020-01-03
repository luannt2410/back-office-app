import { Component } from '@angular/core';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    console.log("in logout");
    console.log(localStorage.getItem('currentUser'));
    localStorage.clear();
    console.log(localStorage.getItem('currentUser'));
  }
}
