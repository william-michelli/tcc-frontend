import { Component, signal, ViewChild } from '@angular/core';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { FilterComponent } from './components/filter/filter.component';
import { UserService, AppUser } from './services/user.service';
import { Job } from './models/job';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule  } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    JobDetailComponent,
    JobListComponent,
    FilterComponent,
    RouterOutlet,
    RouterModule 
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  
  user: AppUser = {};
    @ViewChild('jobList') jobList!: JobListComponent;


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

  protected readonly title = signal('job-frontend');
  selectedJob?: Job;

  onJobSelected(job: Job) {
    this.selectedJob = job;
  }

  isLoginPage(): boolean {
    return this.router.url === '/companies/login'; // ou a rota que deseja
  }
}