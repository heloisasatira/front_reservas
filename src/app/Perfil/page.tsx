"use client";
import React, { useEffect, useState } from "react";
import { ApiURL } from "../Config";
import { Perfil } from "../Types/perfil"; // Importa o tipo definido
import { parseCookies } from "nookies";
import styles from './page.module.css';
import { useRouter } from "next/navigation";


const PerfilUsuario: React.FC = () => {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const router = useRouter();

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

      setEditando(false);
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
    <div className={styles.container}>
      <h1 className={styles.title}>Perfil do Usuário</h1>
      <div className={styles.card}>
  <div className={styles.labelContainer}>
    <label className={styles.textField}>
      Nome:
      {editando ? (
        <input
          type="text"
          value={perfil.nome}
          onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
          className={styles.inputField}
        />
      ) : (
        <span> {perfil.nome}</span>
      )}
    </label>
  </div>
  <div className={styles.labelContainer}>
    <label className={styles.textField}>
      Email:
      {editando ? (
        <input
          type="email"
          value={perfil.email}
          onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
          className={styles.inputField}
        />
      ) : (
        <span> {perfil.email}</span>
      )}
    </label>
  </div>
  <div className={styles.buttonContainer}>
    {editando ? (
      <button
        onClick={handleSalvar}
        disabled={atualizando}
        className={styles.button}
      >
        {atualizando ? "Salvando..." : "Salvar"}
      </button>
    ) : (
      <button
        onClick={() => setEditando(true)}
        className={styles.button}
      >
        Editar
      </button>
    )}
    <button
      onClick={() => { router.push('/Inicio/redirecionamento')}}
        className={styles.button}
      >
        Voltar
      </button>
  </div>
</div>
    </div>
  );
};

export default PerfilUsuario;
