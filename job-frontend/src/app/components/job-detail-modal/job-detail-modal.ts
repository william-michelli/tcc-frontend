import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobDetailComponent } from '../job-detail/job-detail.component'; // <-- IMPORTAR

@Component({
  selector: 'app-job-detail-modal',
  imports: [MatDialogModule, JobDetailComponent],
  templateUrl: './job-detail-modal.html',
  styleUrl: './job-detail-modal.css'
})
export class JobDetailModal {
  constructor(
    @Inject(MAT_DIALOG_DATA) public job: any,
    private dialog: MatDialogRef<JobDetailModal>
  ) {}

  close() {
    this.dialog.close();
  }
}
