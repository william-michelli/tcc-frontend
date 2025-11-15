import { Component, Input } from '@angular/core';
import { Job } from '../../models/job';
import { JobDetailComponent } from '../job-detail/job-detail.component';

@Component({
  selector: 'app-job-detail-solo',
  imports: [JobDetailComponent],
  templateUrl: './job-detail-solo.html',
  styleUrl: './job-detail-solo.css'
})
export class JobDetailSolo {
  @Input() job?: Job;
}
