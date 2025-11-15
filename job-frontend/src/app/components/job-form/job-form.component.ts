import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { JobService } from '../../services/job.service';
import { JobCreate } from '../../models/job-create';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../../models/job';
import { Router  } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-form',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatChipsModule, MatIconModule],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css'
})
export class JobFormComponent  {

  constructor(
    private jobService: JobService, 
    private location: Location, 
    public router: Router, 
    private snackBar: MatSnackBar
  ) {}


  job: JobCreate = {
    title: '',
    description: '',
    contractType: '',
    modality: '',
    email: '',
    phone: '',
    link: '',
    uf: '',
    city: '',
    coursesids: [],
    tags: []
  };

  // Opções de exemplo
  contractTypes = ['CLT', 'PJ', 'Estágio'];
  modalities = ['Presencial', 'Remoto', 'Híbrido'];
  ufs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];
  courses: Course[] = [];

  tagsInput = '';

  ngOnInit() {
    this.jobService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  formSubmitted = false;

  goBack() {
    this.location.back(); // volta para a página anterior
  }

  submit(form: any) {
    this.formSubmitted = true;

    if (form.invalid) {
      console.log('Formulário inválido!');
      return;
    }

    this.job.tags = this.tagsInput.split(';').map(t => t.trim()).filter(t => t);

    console.log("guids",  this.job.coursesids)
   
    this.jobService.insertJob(this.job).subscribe({
      next: (res) => {
        this.snackBar.open('Vaga cadastrada com sucesso. Agurde a administração aprovar a vaga.', 'Fechar', {
          duration: 3000,
          panelClass: ['custom-snackbar-approved'] // aqui você aplica a classe
        });
      },
      error: (err) => {
        console.error('Erro ao cadastrar job', err);
        alert('Erro ao cadastrar job');
      }
    });

    window.location.href = '/tcc-frontend/';//Navega pra tela inicial
  }
}
