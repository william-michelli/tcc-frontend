import { Component, EventEmitter, OnInit, Output, LOCALE_ID  } from '@angular/core';
import { JobService } from '../../services/job.service';
import { UserService } from '../../services/user.service';
import { Job } from '../../models/job';
import { CommonModule,registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// <-- registra o locale
registerLocaleData(localePt);

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' } // <-- define locale aqui
  ],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  @Output() jobSelected = new EventEmitter<Job>();

  page = 1;
  pageSize = 10;
  loading = false;
  allLoaded = false;
  currentStatus?: string;
  currentFilterText?: string;

  constructor(
    private jobService: JobService,
    public userService: UserService
  ) { }

ngOnInit(): void {
  // Inscreve no BehaviorSubject para atualizações locais
  this.jobService.jobs$.subscribe(jobs => {
    this.jobs = jobs; // sempre reflete o estado atual
  });

  // Carrega os jobs iniciais
  this.loadJobs(true);
}

loadJobs(reset: boolean = false) {
  if (this.loading || this.allLoaded) return;

  if (reset) {
    this.page = 1;
    this.jobService.clearJobs(); // limpa BehaviorSubject
  }

  this.loading = true;

  this.jobService.getJobs(this.currentStatus, this.currentFilterText, this.page, this.pageSize)
    .subscribe(res => {
      if (res.length === 0) {
        this.allLoaded = true;
      } else {
        this.jobService.addJobs(res); // adiciona ao BehaviorSubject
        if (this.page === 1 && res.length) {
          this.jobSelected.emit(res[0]);
        }
        this.page++;
      }
      this.loading = false;
    });
  }

  onScroll(event: any) {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;

    if (atBottom) {
      this.loadJobs();
    }
  }

  
  applyFilter(status?: string, filterText?: string) {
    this.currentStatus = status || '';       // se undefined, usa ''
    this.currentFilterText = filterText || ''; // se undefined, usa ''
    this.page = 1; 
    this.allLoaded = false; // reset total loaded
    this.jobs = [];
    this.loadJobs(true);
  }

  selectJob(job: Job) {
    this.jobSelected.emit(job);
  }
}
