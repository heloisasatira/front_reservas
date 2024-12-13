'use client';
import styles from "./page.module.css";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie, parseCookies } from 'nookies';
import { ApiURL } from "../Config";
import Titulo from "../components/titulo";

const CadastrarMesa = () => {
  const [mesa, setMesa] = useState({
    nome: '',
    numero: ''
  });

  const [msgError, setMsgError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const { 'restaurant-token': token } = parseCookies();

    // Verificar se o token está presente e é de um administrador
    if (!token) {
      router.push('/Login');
    } else {
      (async () => {
        try {
          const response = await fetch(`${ApiURL}/auth/verify-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();

          if (!data || data.tipo !== 'Adm') {
            setMsgError('Acesso negado. Somente administradores podem cadastrar mesas.');
            router.push('/');
          }
        } catch (error) {
          console.error('Erro ao verificar token:', error);
          setMsgError('Erro ao verificar permissão. Faça login novamente.');
          router.push('/Login');
        }
      })();
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { 'restaurant-token': token } = parseCookies();
      const response = await fetch(`${ApiURL}/mesas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(mesa)
      });

      if (response.ok) {
        const data = await response.json();
        alert('Mesa cadastrada com sucesso!');
        router.push('/');
      } else {
        const errorData = await response.json();
        setMsgError(errorData.mensagem || 'Erro ao cadastrar a mesa.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar mesa:', error);
      setMsgError('Erro no servidor. Por favor, tente novamente mais tarde.');
    }
  };

  const alterarNome = (novoNome: string) => {
    setMesa((valoresAnteriores) => ({
      ...valoresAnteriores,
      nome: novoNome
    }));
  };

  const alterarNumero = (novoNumero: string) => {
    setMesa((valoresAnteriores) => ({
      ...valoresAnteriores,
      numero: novoNumero
    }));
  };

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Titulo titulo="Cadastrar Mesa" />
        {msgError && <p className={styles.error}>{msgError}</p>}

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Nome da Mesa"
            value={mesa.nome}
            onChange={(e) => alterarNome(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Número da Mesa"
            value={mesa.numero}
            onChange={(e) => alterarNumero(e.target.value)}
            required
          />
        </div>

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
              justifyContent: 'center'
            }}
          >
            Cadastrar Mesa
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
              justifyContent: 'center'
            }}
            onClick={() => { router.push('/'); }}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastrarMesa;