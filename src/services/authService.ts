import { http } from './http';

export interface LoginRequestDTO {
  email: string;
  senha: string;
}

export interface LoginResponseDTO {
  id: number;
  nome: string;
  email: string;
  token: string;
}

export const authService = {
  async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    const response = await http.post<LoginResponseDTO>('/auth/login', credentials);
    return response.data;
  },
};