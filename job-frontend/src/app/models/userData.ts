//Informacoes do usuario no BACKEND
export interface UserData {
  name: string;
  email: string;
  companyName: string | null;
  isAdmin: boolean;
  accessToken: string;
}

export interface UserGoogle {
  googleId: string;
  name: string;
  picture: string;
  email: string;
}