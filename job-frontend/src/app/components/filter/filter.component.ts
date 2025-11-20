import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { JobService } from '../../services/job.service';
import { UserService } from '../../services/user.service';
import { Job } from '../../models/job';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  jobs: Job[] = [];
  isMobile = false;

  
  ngOnInit(): void {
    this.breakpoint.observe(['(max-width: 1400px)']).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  constructor(
    private jobService: JobService,
    public userService: UserService,
    private breakpoint: BreakpointObserver
  ) {}

  statusOptions: string[] = ['TODOS', 'APROVADO', 'PENDENTE', 'REJEITADO', 'ENCERRADO'];
  selectedStatus: string = '';
  textFilter: string = '';

  @Output() filterChanged = new EventEmitter<{status?: string, filterText?: string}>();

  onStatusChange(event: any) {
    const status = event.target.value;
    this.filterChanged.emit({ status, filterText: this.textFilter });
  }
  
  onApplyTextFilter() {
    this.filterChanged.emit({ status: this.selectedStatus, filterText: this.textFilter });
  }

  onClearTextFilter() {
    this.selectedStatus = '';
    this.textFilter = '';
    this.filterChanged.emit({ status: undefined, filterText: undefined });
  }
}
