"use client";
import React, { useEffect, useState } from "react";
import { ApiURL } from "../Config"; // URL da API que vai gerenciar os dados do perfil.
import { Perfil } from "../Types/perfil"; // Tipo "Perfil" pra garantir que os dados estão certinhos.
import { parseCookies } from "nookies"; // Pra pegar os cookies (inclusive o token do usuário).
import styles from './page.module.css'; // CSS bonitinho pra estilizar a página.
import { useRouter } from "next/navigation"; // Usado pra navegar entre páginas.

const PerfilUsuario: React.FC = () => {
  // Aqui começam os estados que controlam a página.
  const [perfil, setPerfil] = useState<Perfil | null>(null); // Guarda os dados do perfil.
  const [erro, setErro] = useState<string | null>(null); // Pra exibir mensagens de erro.
  const [editando, setEditando] = useState(false); // Indica se o perfil tá no modo de edição.
  const [atualizando, setAtualizando] = useState(false); // Indica se tá salvando as alterações.
  const router = useRouter(); // Pra redirecionar o usuário pra outras páginas.

  useEffect(() => {
    // Função que busca os dados do perfil do usuário na API.
    const fetchPerfil = async () => {
      const { 'restaurant-token': token } = parseCookies(); // Pega o token dos cookies.
      if (!token) {
        // Se o token não existir, mostra um erro e sai.
        setErro("Token não encontrado. Por favor, faça login novamente.");
        return;
      }

      try {
        // Fazendo uma requisição GET pra buscar o perfil.
        const response = await fetch(`${ApiURL}/perfil`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho.
          },
        });

        if (!response.ok) {
          // Se a resposta não for "ok", pega o erro e lança uma exceção.
          const errorMessage = await response.text();
          throw new Error(`Erro ${response.status}: ${errorMessage}`);
        }

        const data: Perfil = await response.json(); // Converte a resposta pra JSON.
        setPerfil(data); // Atualiza o estado com os dados do perfil.
      } catch (error: any) {
        // Se der qualquer erro, exibe a mensagem.
        setErro(error.message || "Erro desconhecido");
      }
    };

    fetchPerfil(); // Chama a função assim que a página carrega.
  }, []);

  // Função pra salvar as alterações feitas no perfil.
  const handleSalvar = async () => {
    if (!perfil) return; // Se o perfil não existir, não faz nada.

    setAtualizando(true); // Indica que tá salvando os dados.
    const { 'restaurant-token': token } = parseCookies(); // Pega o token de novo.

    try {
      // Faz uma requisição PATCH pra atualizar os dados do perfil.
      const response = await fetch(`${ApiURL}/perfil`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Dizendo que os dados são JSON.
          Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho.
        },
        body: JSON.stringify(perfil), // Envia os dados atualizados.
      });

      if (!response.ok) {
        // Se deu erro na resposta, pega a mensagem.
        const errorMessage = await response.text();
        throw new Error(`Erro ${response.status}: ${errorMessage}`);
      }

      setEditando(false); // Sai do modo de edição.
    } catch (error: any) {
      // Mostra o erro se der ruim.
      setErro(error.message || "Erro desconhecido");
    } finally {
      setAtualizando(false); // Diz que terminou de salvar (independente do resultado).
    }
  };

  // Se der erro, mostra a mensagem.
  if (erro) {
    return <p>Erro: {erro}</p>;
  }

  // Enquanto os dados do perfil não carregam, mostra "Carregando...".
  if (!perfil) {
    return <p>Carregando...</p>;
  }

  // Aqui começa o que aparece na tela.
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Perfil do Usuário</h1>
      <div className={styles.card}>
        {/* Nome do usuário */}
        <div className={styles.labelContainer}>
          <label className={styles.textField}>
            Nome:
            {editando ? (
              <input
                type="text"
                value={perfil.nome}
                onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })} // Atualiza o estado com o novo nome.
                className={styles.inputField}
              />
            ) : (
              <span> {perfil.nome}</span> // Mostra o nome se não estiver editando.
            )}
          </label>
        </div>

        {/* Email do usuário */}
        <div className={styles.labelContainer}>
          <label className={styles.textField}>
            Email:
            {editando ? (
              <input
                type="email"
                value={perfil.email}
                onChange={(e) => setPerfil({ ...perfil, email: e.target.value })} // Atualiza o estado com o novo email.
                className={styles.inputField}
              />
            ) : (
              <span> {perfil.email}</span> // Mostra o email se não estiver editando.
            )}
          </label>
        </div>

        {/* Botões de ação */}
        <div className={styles.buttonContainer}>
          {editando ? (
            <button
              onClick={handleSalvar} // Salva as alterações.
              disabled={atualizando} // Desativa o botão se estiver salvando.
              className={styles.button}
            >
              {atualizando ? "Salvando..." : "Salvar"} {/* Troca o texto dependendo do estado. */}
            </button>
          ) : (
            <button
              onClick={() => setEditando(true)} // Entra no modo de edição.
              className={styles.button}
            >
              Editar
            </button>
          )}
          <button
            onClick={() => { router.push('/Inicio/redirecionamento') }} // Volta pra página inicial.
            className={styles.button}
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario; // Exporta o componente pra ser usado em outros lugares.
