"use client"
import React, { useEffect, useState } from "react";
import { ApiURL } from "../Config";
import { Perfil } from "../Types/perfil"; // Importa o tipo definido
import { setCookie, parseCookies } from "nookies";

const PerfilUsuario: React.FC = () => {
  const [perfil, setPerfil] = useState<Perfil | null>(null); // Estado tipado
  const [erro, setErro] = useState<string | null>(null); // Estado para mensagens de erro
  const [editando, setEditando] = useState(false); // Estado para alternar modo de edição
  const [atualizando, setAtualizando] = useState(false); // Estado para controlar o envio

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

  const handleSalvar = async () => {
    if (!perfil) return;

    setAtualizando(true);
    const { 'restaurant-token': token } = parseCookies();

    try {
      const response = await fetch(`${ApiURL}/perfil`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(perfil),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erro ${response.status}: ${errorMessage}`);
      }

      setEditando(false); // Sai do modo de edição
    } catch (error: any) {
      setErro(error.message || "Erro desconhecido");
    } finally {
      setAtualizando(false);
    }
  };

  if (erro) {
    return <p>Erro: {erro}</p>;
  }

  if (!perfil) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      <div>
        <label>
          <strong>Nome:</strong>
          {editando ? (
            <input
              type="text"
              value={perfil.nome}
              onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
            />
          ) : (
            <span> {perfil.nome}</span>
          )}
        </label>
      </div>
      <div>
        <label>
          <strong>Email:</strong>
          {editando ? (
            <input
              type="email"
              value={perfil.email}
              onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
            />
          ) : (
            <span> {perfil.email}</span>
          )}
        </label>
      </div>
      {editando ? (
        <button onClick={handleSalvar} disabled={atualizando}>
          {atualizando ? "Salvando..." : "Salvar"}
        </button>
      ) : (
        <button onClick={() => setEditando(true)}>Editar</button>
      )}
    </div>
  );
};

export default PerfilUsuario;
