import { Course } from '../models/job';

export interface JobCreate {
  title: string;
  description: string;
  contractType: string;      // ex: "ESTÁGIO"
  modality: string;          // ex: "PRESENCIAL"
  email: string;
  phone: string;
  link: string,
  uf: string;                // UF
  city: string;
  coursesids?: string[];
  tags?: string[];
}