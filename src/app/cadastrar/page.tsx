'use client';
import styles from './page.module.css';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Usuario from '../interfaces/usuario';
import { setCookie } from 'nookies';
import { ApiURL } from '../Config';

const Cadastrar = () => {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: '',
    email: '',
    password: '',
    tipo: 'cliente',
  });

  const [msgError, setMsgError] = useState('');
  const router = useRouter();

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

      if (response.ok) {
        const data = await response.json();
        const { erro, mensagem, token, redirectUrl } = data;

        if (erro) {
          setMsgError(mensagem);
        } else {
          setCookie(undefined, 'restaurant-token', token, {
            maxAge: 60 * 60 * 1, // 1 hora
          });
          if (!erro) {
            router.push(redirectUrl); // Usando o valor retornado pela API para redirecionar
          }
        }
      } else {
        setMsgError('Erro ao realizar cadastro. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMsgError('Erro no servidor. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Cadastro</h2>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Nome"
            value={usuario.nome}
            onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="E-mail"
            value={usuario.email}
            onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Senha"
            value={usuario.password}
            onChange={(e) => setUsuario({ ...usuario, password: e.target.value })}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <select
            value={usuario.tipo}
            onChange={(e) =>
              setUsuario({ ...usuario, tipo: e.target.value as 'cliente' | 'admin' })
            }
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button  style={{
                width: '204px',
                height: '50px',
                backgroundColor: '#f72585',
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
              }}>Cadastrar</button>
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
      {msgError && <p>{msgError}</p>}
    </div>
  );
};

export default Cadastrar;
