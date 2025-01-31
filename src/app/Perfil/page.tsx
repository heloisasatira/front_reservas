"use client";
import React, { useEffect, useState } from "react";
import { ApiURL } from "../Config";
import { Perfil } from "../Types/perfil"; // Importa o tipo definido
import { parseCookies } from "nookies";
import styles from './page.module.css';
import { useRouter } from "next/navigation";

const PerfilUsuario: React.FC = () => {
  // Define estados para armazenar os dados do perfil, erros, e status de edição/atualização
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const router = useRouter(); // Instância do roteador para manipular navegação

  // useEffect para buscar os dados do perfil do usuário assim que o componente for montado
  useEffect(() => {
    const fetchPerfil = async () => {
      const { 'restaurant-token': token } = parseCookies(); // Obtém o token do usuário armazenado nos cookies
      if (!token) {
        setErro("Token não encontrado. Por favor, faça login novamente."); // Define erro se não houver token
        return;
      }

      try {
        const response = await fetch(`${ApiURL}/perfil`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Passa o token no cabeçalho da requisição
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Erro ${response.status}: ${errorMessage}`); //trata erro de resposta da API
        }

        const data: Perfil = await response.json(); // converte a resposta para JSON e define o estado do perfil
        setPerfil(data);
      } catch (error: any) {
        setErro(error.message || "Erro desconhecido"); // captura erro e define mensagem de erro.
      }
    };

    fetchPerfil(); // chama a função para buscar o perfil
  }, []);

  //função para salvar as alterações do perfil
  const handleSalvar = async () => {
    if (!perfil) return;

    setAtualizando(true); // Ativa estado de atualização
    const { 'restaurant-token': token } = parseCookies(); // Obtém o token novamente

    try {
      const response = await fetch(`${ApiURL}/perfil`, {
        method: "PATCH", // Método PATCH para atualizar dados específicos
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(perfil), // Converte os dados do perfil para JSON e envia
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erro ${response.status}: ${errorMessage}`);
      }

      setEditando(false); //sai do modo de edição após salvar
    } catch (error: any) {
      setErro(error.message || "Erro desconhecido");
    } finally {
      setAtualizando(false); // Finaliza estado de atualização
    }
  };

  // Se houver erro, exibe a mensagem de erro
  if (erro) {
    return <p>Erro: {erro}</p>;
  }

  // Se o perfil ainda não foi carregado, exibe mensagem de carregamento
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
          onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })} // Atualiza o estado do nome ao digitar
          className={styles.inputField}
        />
      ) : (
        <span> {perfil.nome}</span> //exibe nome caso não esteja editando
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
          onChange={(e) => setPerfil({ ...perfil, email: e.target.value })} // Atualiza o estado do email ao digitar
          className={styles.inputField}
        />
      ) : (
        <span> {perfil.email}</span> // Exibe email caso não esteja editando
      )}
    </label>
  </div>
  <div className={styles.buttonContainer}>
    {editando ? (
      <button
        onClick={handleSalvar} // Salva as edições ao clicar no botão
        disabled={atualizando} // desabilita o botão enquanto está salvando.
        className={styles.button}
      >
        {atualizando ? "Salvando..." : "Salvar"}
      </button>
    ) : (
      <button
        onClick={() => setEditando(true)} // habilita o modo de edição
        className={styles.button}
      >
        Editar
      </button>
    )}
    <button
      onClick={() => { router.push('/Inicio/redirecionamento')}} // Redireciona para outra página
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