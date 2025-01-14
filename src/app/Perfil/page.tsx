"use client"
import React, { useEffect, useState } from "react";
import { ApiURL } from "../Config";
import { Perfil } from "../Types/perfil"; // Importa o tipo definido
import { setCookie, parseCookies } from "nookies";

const PerfilUsuario: React.FC = () => {
  const [perfil, setPerfil] = useState<Perfil | null>(null); // Estado tipado
  const [erro, setErro] = useState<string | null>(null); // Estado para mensagens de erro

  useEffect(() => {
    const fetchPerfil = async () => {
      const { 'restaurant-token': token } = parseCookies();
  
      if (!token) {
        setErro("Token não encontrado. Por favor, faça login novamente.");
        return;
      }
  
      try {
        const response = await fetch(`${ApiURL}/perfil`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Erro ${response.status}: ${errorMessage}`);
        }
  
        const data: Perfil = await response.json();
        setPerfil(data);
      } catch (error: any) {
        setErro(error.message || "Erro desconhecido");
      }
    };
  
    fetchPerfil();
  }, []);

  if (erro) {
    return <p>Erro: {erro}</p>;
  }

  if (!perfil) {
    return <p>Carregando...</p>;
  }

  //retornando as informações do usuário
  return (
    <div>
      <h1>Perfil do Usuário</h1>
      <p><strong>Nome:</strong> {perfil.nome}</p>
      <p><strong>Email:</strong> {perfil.email}</p>
    </div>
  );
};

export default PerfilUsuario;
