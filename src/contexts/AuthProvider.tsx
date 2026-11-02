import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginRequestDTO, LoginResponseDTO } from '../services/authService';

interface AuthContextData {
  usuario: LoginResponseDTO | null;
  token: string | null;
  entrar(dados: LoginRequestDTO): Promise<void>;
  sair(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<LoginResponseDTO | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token_jwt');
    const usuarioSalvo = localStorage.getItem('usuario_logado');

    if (tokenSalvo && usuarioSalvo) {
      setToken(tokenSalvo);
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);

  const entrar = async (dados: LoginRequestDTO) => {
    const resposta = await authService.login(dados);
    
    setToken(resposta.token);
    setUsuario(resposta);

    localStorage.setItem('token_jwt', resposta.token);
    localStorage.setItem('usuario_logado', JSON.stringify(resposta));
  };

  const sair = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token_jwt');
    localStorage.removeItem('usuario_logado');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
};