import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, AppUser } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterModule ],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})

export class UserDetailsComponent {
  
  user: AppUser = {};
  isMobile = false;

  constructor(
    public router: Router,    
    private userService: UserService,
    private breakpoint: BreakpointObserver
  ) {}

  ngOnInit() {
    // Subscribe para receber atualizações do usuário
    this.userService.user$.subscribe(u => {
      this.user = u;
    });

    this.breakpoint.observe(['(max-width: 1400px)']).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  logout() {
    this.userService.logout();
  }

  newJob() {
    this.router.navigate(['/jobs/new']);
  }

  enterProfile() {
    this.router.navigate(['/profile']);
  }

    
  menuOpen = false;

  toggleUserMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
