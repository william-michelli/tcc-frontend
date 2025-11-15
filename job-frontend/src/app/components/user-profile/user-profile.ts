import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { JobService } from '../../services/job.service';
import { UserService } from '../../services/user.service';
import { JobCreate } from '../../models/job-create';
import { UserData, UserGoogle } from '../../models/userData';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../../models/job';
import { Router  } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatChipsModule, MatIconModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile {

  userBackend: UserData = {} as UserData;
  userGoogle: UserGoogle = {} as UserGoogle;
  formSubmitted = false;

  constructor(
    private userService: UserService, 
    private location: Location, 
    public router: Router, 
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const userB = this.userService.getBackendUser();
    if (userB) {
      this.userBackend = userB;
    } else {
      console.warn('Usuário ainda não disponível no BehaviorSubject');
    }

    const userG = this.userService.getGoogleUser();
    if (userG) {
      this.userGoogle = userG;
    } else {
      console.warn('Usuário ainda não disponível no BehaviorSubject');
    }
  }

  goBack() {
    this.location.back(); // volta para a página anterior
  }

  submit(form: any) {
    this.formSubmitted = true;

    if (form.invalid) {
      console.log('Formulário inválido!');
      return;
    }

    this.userService.updateUserCompany(this.userBackend).subscribe({
      next: (res) => {

        this.userService.updateUserCompanyLocally(this.userBackend);

        this.snackBar.open('Nome da empresa atualizada com sucesso.', 'Fechar', {
          duration: 3000,
          panelClass: ['custom-snackbar-approved']
        });
      },
      error: (err) => {
        console.error('Erro ao atualizar', err);
        alert('Erro ao atualizar');
      }
    });
  }
}
