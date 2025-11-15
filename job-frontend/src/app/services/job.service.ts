import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Job } from '../models/job';
import { UserData } from '../models/userData';
import { Course } from '../models/course';
import { UserService } from '../services/user.service';
import { JobCreate } from '../models/job-create';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  //private baseUrl = 'http://localhost:5294/api/';
  private baseUrl = 'https://servicolinux-epgcchhfetabakda.brazilsouth-01.azurewebsites.net/api/';

  private apiUrl = this.baseUrl + 'Job'; 
  private coursesUrl = this.baseUrl + 'Job/Courses'; 
  private postUrl = this.baseUrl + 'Job'; 
  private authUrl = this.baseUrl + 'Login/google-login'; 


  private jobsSubject = new BehaviorSubject<Job[]>([]); // lista central
  jobs$ = this.jobsSubject.asObservable();

  constructor(
    private http: HttpClient,
    public userService : UserService
  ) {
    this.getJobs()
  }

  getJobs(status?: string, filterText?: string, page: number = 1, pageSize: number = 10): Observable<Job[]> {
    const accessToken = localStorage.getItem("accessToken");
    const headers: any = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const params: any = { page, pageSize };
    if (status) params['status'] = status;
    if (filterText) params['filterText'] = filterText;

    return this.http.get<Job[]>(this.apiUrl, { headers, params });
  }

   getJobById(id: string):  Observable<Job> {
    const accessToken = localStorage.getItem("accessToken");
    const headers: any = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Job>(url, { headers });
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl); // endpoint do seu backend
  }

  updateJobs(jobs: Job[]) {
    this.jobsSubject.next(jobs);
  }

  insertJob(job: JobCreate) {
    const headers: any = {};

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;


    return this.http.post<JobCreate>(this.postUrl, job, { headers });
  }


  // 🔑 Login com Google
  loginWithGoogle(tokenJWT: string): Observable<UserData> {
    var user = this.http.post<UserData>(
      this.authUrl,     
      { token_jwt: tokenJWT }, // envia como JSON
      { headers: { 'Content-Type': 'application/json' } }
    );

    return user;
  }

  updateJobStatus(jobId: string, status: string): Observable<Job> {
    const url = `${this.apiUrl}/status/${jobId}`;
    const body = { status };
    const headers: any = {};

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    var result = this.http.put<Job>(url, body, { headers });
    
    return result;
  }

  updateJobStatusLocally(jobId: string, status: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'ENCERRADO') {
    const jobs = this.jobsSubject.getValue();

    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        return { ...job, status }; // cria novo objeto para disparar mudança
      }
      return job;
    });

    this.jobsSubject.next(updatedJobs); // dispara atualização para todos os assinantes
  }

  // limpa todos os jobs
  clearJobs() {
    this.jobsSubject.next([]);
  }

  // adiciona jobs sem sobrescrever
  addJobs(newJobs: Job[]) {
    const current = this.jobsSubject.getValue();
    this.jobsSubject.next([...current, ...newJobs]);
  }
}