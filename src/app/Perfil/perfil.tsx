import React, { useEffect, useState } from "react";
import { Perfil } from "../Types/perfil"; // Importa o tipo definido

const PerfilUsuario: React.FC = () => {
  const [perfil, setPerfil] = useState<Perfil | null>(null); // Estado tipado
  const [erro, setErro] = useState<string | null>(null); // Estado para mensagens de erro

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await fetch("/api/perfil", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar o perfil");
        }

        const data: Perfil = await response.json(); // Garante que a resposta siga o tipo Perfil
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

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      <p><strong>Nome:</strong> {perfil.nome}</p>
      <p><strong>Email:</strong> {perfil.email}</p>
    </div>
  );
};

export default PerfilUsuario;
