'use client';

import styles from "./page.module.css";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Usuario from "../interfaces/usuario";
import { setCookie, parseCookies } from 'nookies';
import { ApiURL } from "../Config";

const Cadastrar = () => {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: '',
    email: '',
    password: '',
    tipo: 'cliente' // Tipo inicial como 'cliente'
  });

  const [msgError, setMsgError] = useState('');
  const router = useRouter();

  // Verifica o erro sempre que ele for atualizado
  useEffect(() => {
    console.log(msgError);
  }, [msgError]);

  // Função para manipular o envio do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ApiURL}/auth/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });

      if (response) {
        const data = await response.json();
        const { erro, mensagem, token } = data;

        if (erro) {
          setMsgError(mensagem);
        } else {
          setCookie(undefined, 'restaurant-token', token, {
            maxAge: 60 * 60 * 1, // 1 hora
          });
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMsgError('Erro no servidor. Por favor, tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    const { 'restaurant-token': token } = parseCookies();
    if (token) {
      router.push('/');
    }
  }, [router]);

  // Funções para atualizar os valores dos campos
  const alterarNome = (novoNome: string) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      nome: novoNome,
    }));
  };

  const alterarEmail = (novoEmail: string) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      email: novoEmail,
    }));
  };

  const alterarSenha = (novaSenha: string) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      password: novaSenha,
    }));
  };

  const alterarTipo = (novoTipo: 'cliente' | 'admin') => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      tipo: novoTipo,
    }));
  };

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Cadastro</h2>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Nome"
            value={usuario?.nome}
            onChange={(e) => alterarNome(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="E-mail"
            value={usuario?.email}
            onChange={(e) => alterarEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Senha"
            value={usuario?.password}
            onChange={(e) => alterarSenha(e.target.value)}
            required
          />
        </div>

        {/* Dropdown para selecionar tipo de usuário */}
        <div className={styles.inputGroup}>
          <select
            value={usuario.tipo}
            onChange={(e) => alterarTipo(e.target.value as 'cliente' | 'admin')}
            required
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {msgError && <div className={styles.error}>{msgError}</div>}

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            style={{
              width: '204px',
              height: '50px',
              backgroundColor: '#ff0084',
              borderRadius: '5px',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 160ms linear, transform 160ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Cadastrar
          </button>
        </div>

        <div className="input-group">
          <button
            style={{
              width: '204px',
              height: '50px',
              backgroundColor: 'black',
              borderRadius: '5px',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 160ms linear, transform 160ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => router.push('/Login')}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Cadastrar;