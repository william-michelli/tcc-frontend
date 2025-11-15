import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, AppUser } from '../../services/user.service';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})

export class UserDetailsComponent {
  
  user: AppUser = {};

  constructor(
    public router: Router,    
    private userService: UserService
  ) {}

  ngOnInit() {
    // Subscribe para receber atualizações do usuário
    this.userService.user$.subscribe(u => {
      this.user = u;
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
}
