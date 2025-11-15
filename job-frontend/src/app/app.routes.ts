import { Routes } from '@angular/router';
import { JobFormComponent } from './components/job-form/job-form.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { LoginScreen } from './components/login-screen/login-screen';
import { JobDetailSolo } from './components/job-detail-solo/job-detail-solo';
import { UserProfile } from './components/user-profile/user-profile';

export const routes: Routes = [
    { path: '', component: UserDetailsComponent },
    { path: 'companies/login', component: LoginScreen },
    { path: 'jobs/new', component: JobFormComponent },
    { path: 'jobs/:id', component: JobDetailSolo },
    { path: 'profile', component: UserProfile },
];
