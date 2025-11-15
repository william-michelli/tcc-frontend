export interface Job {
  id: string;                // UUID do backend
  title: string;
  description: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'ENCERRADO';

  userId: string;
  userEmail: string;
  userName: string;
  userCompanyName: string;

  contractType: string;      // ex: "ESTÁGIO"
  modality: string;          // ex: "PRESENCIAL"
  email: string;
  phone: string;
  uf: string;                // UF
  city: string;
  link: string;
  creationDate: string;      // ISO date string
  courses?: Course[];
  tags?: Tag[];
}

export interface Course {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}