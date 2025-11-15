import { Component, Input, LOCALE_ID } from '@angular/core';
import { Job } from '../../models/job';
import { CommonModule, registerLocaleData  } from '@angular/common';
import { UserService } from '../../services/user.service';
import { JobService } from '../../services/job.service';
import localePt from '@angular/common/locales/pt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

// <-- registra o locale
registerLocaleData(localePt);

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' } // <-- define locale aqui
  ],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent {
  @Input() job?: Job;

  //Se o emprego veio de um click da listagem ou de um link
  isSolo: boolean = false;

  constructor(
    public userService : UserService,
    private jobService : JobService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userData = this.userService.getBackendUser();
    console.log('Usuário logado:', userData);

    if (this.userService.isAdmin()) {
      console.log('Esse usuário é admin');
    }

    // Se não recebeu job via Input, tenta pegar da URL
    if (!this.job) {
      this.isSolo = true;
      const jobId = this.route.snapshot.paramMap.get('id');
      if (jobId) this.loadJobById(jobId);
    }
  }

  loadJobById(id: string) {
    this.jobService.getJobById(id).subscribe({
      next: job => {
        this.job = job;
      },
      error: err => {
        console.error('Erro ao carregar job pelo ID', err);
      }
    });
  }

  copyLink() {
    if (this.job) {
      const base = window.location.origin + '/tcc-frontend/#'; 
      navigator.clipboard.writeText(base).then(() => {
        this.snackBar.open('Link copiado!', 'Fechar', { duration: 2000 });
      });
    }
  }

  getTagNames(): string {
    if (!this.job?.tags || this.job.tags.length === 0) {
      return 'Nenhuma tag especificada';
    }
    return this.job.tags.map(t => t.name).join(', ');
  }

  getCourseNames(): string {
    if (!this.job?.courses || this.job.courses.length === 0) {
      return 'Nenhum curso especificado';
    }
    return this.job.courses.map(c => c.name).join(', ');
  }

  approveJob(job: Job) {
  this.jobService.updateJobStatus(job.id, 'APROVADO').subscribe({
    next: updatedJob => {
      // Atualiza o job local sem precisar dar refresh
      this.job = { ...this.job!, status: 'APROVADO' };
      this.jobService.updateJobStatusLocally(job.id, 'APROVADO');

      this.snackBar.open('Vaga aprovada com sucesso!', 'Fechar', {
        duration: 3000,
        panelClass: ['custom-snackbar-approved'] // aqui você aplica a classe
      });
    },
    error: err => console.error('Erro ao aprovar job', err)
  });
}

  rejectJob(job: Job) {
    this.jobService.updateJobStatus(job.id, 'REJEITADO').subscribe({
      next: updatedJob => {
        // Atualiza o job local sem precisar dar refresh
        this.job = { ...this.job!, status: 'REJEITADO' };
        this.jobService.updateJobStatusLocally(job.id, 'REJEITADO');

        this.snackBar.open('Vaga rejeitada com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['custom-snackbar-rejected'] // aqui você aplica a classe
        });
      },
      error: err => console.error('Erro ao rejeitar job', err)
    });
  }

  closeJob(job: Job) {
    this.jobService.updateJobStatus(job.id, 'ENCERRADO').subscribe({
      next: updatedJob => {
        // Atualiza o job local sem precisar dar refresh
        this.job = { ...this.job!, status: 'ENCERRADO' };
        this.jobService.updateJobStatusLocally(job.id, 'ENCERRADO');

        this.snackBar.open('Vaga encerrada com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['custom-snackbar-closed'] 
        });
      },
      error: err => console.error('Erro ao encerrar job', err)
    });
  }
  
  formatPhone(number: string): string {
    // Remove tudo que não for dígito
    const digits = number.replace(/\D/g, '');

    if (digits.length === 11) {
      // celular: (XX) XXXXX-XXXX
      return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
    } else if (digits.length === 10) {
      // telefone fixo: (XX) XXXX-XXXX
      return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
    } else {
      // número inválido ou outros casos
      return number;
    }
  }
  
  showUserModal = false;
  openUserModal() {
    this.showUserModal = true;
  }

  closeUserModal() {
    this.showUserModal = false;
  }
}
