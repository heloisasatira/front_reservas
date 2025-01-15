'use client';
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie, parseCookies } from "nookies";
import Titulo from "../components/titulo";
import styles from "./login.module.css";
import { ApiURL } from "../Config";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msgError, setMsgError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${ApiURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      if (response) {
        const data = await response.json();
        console.log(data);
        const { erro, mensagem, token } = data;
        if (erro) {
          setMsgError(mensagem);
        } else {
          // Armazena o token em um cookie
          setCookie(undefined, 'restaurant-token', token, {
            maxAge: 60 * 60 * 1 // 1 hora
          });
          // Redireciona para a página redirecionamento.tsx
          router.push('/Inicio/redirecionamento');
        }
      } else {
        setMsgError('Login falhou. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMsgError('Erro no servidor. Por favor, tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    const { 'restaurant-token': token } = parseCookies();
    if (token) {
      router.push('/Inicio/redirecionamento');
    }
  }, [router]);

  return (
    <div className={styles.page}>
      <div>
        <form onSubmit={handleSubmit} id="ptac" className={styles.form}>
          <Titulo titulo="Autenticação" />
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              style={{
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
              }}
            >
              Entrar
            </button>
            <div style={{ textAlign: 'center' }}>
              <a
                className="btn"
                onClick={() => router.push('/Cadastrar')}
                style={{ cursor: "pointer", color: '#ff007f' }}
              >
                Novo Cadastro
              </a>
            </div>
            <div className="input-group">
              <button
                type="button"
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
                onClick={() => { router.push('/') }}
              >
                Voltar
              </button>
            </div>
          </div>
        </form>
        {msgError && <p>{msgError}</p>} {/* Exibe a mensagem de erro, se houver */}
      </div>
    </div>
  );
};

export default Login;
