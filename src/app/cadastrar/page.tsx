'use client';
import styles from "./page.module.css";
import { FormEvent, useState, useEffect } from "react"; import { useRouter } from "next/navigation";
import Usuario from "../interfaces/usuario";
import Titulo from "../components/titulo";
import ButtonCadastro from "../components/buttonCadastrar";
import { setCookie, parseCookies } from 'nookies';
import { ApiURL } from "../Config";

const Cadastrar = () => {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: '',
    email: '',
    password: '',
    tipo: 'Cliente'
  });
  //este usuario precisa ter as caracteristicas de Usuario
  
  const [msgError, setMsgError] = useState('');
  const router = useRouter();
  
  useEffect(()=>{
    console.log(msgError)
  },[msgError])

  const handleSubmit = async (e: FormEvent) => {
    console.log('teste')
    e.preventDefault();

    try {
      const response = await fetch(`${ApiURL}/auth/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
      });
      console.log(response)

      if (response) {
        const data = await response.json();
        const { erro, mensagem, token } = data;

        if (erro) {
          setMsgError(mensagem);
        } else {
          setCookie(undefined, 'restaurant-token', token, {
            maxAge: 60 * 60 * 1 // 1 hora
          });
          router.push('/');
        }
      } else {
        
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

  const alterarNome = (novoNome: string) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      nome: novoNome
    }))
  }

  const alterarEmail = (novoEmail: string) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      email: novoEmail
    }))
  }

  const alterarSenha = (novaSenha: string) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      password: novaSenha
    }))
  }
  const [error, setError] = useState('');
  const route = useRouter();

  return (
    <div className={styles.page}>

      <form className={styles.form} onSubmit={handleSubmit} >
        <Titulo titulo="Cadastro" />
        <div className={styles.inputGroup}>
          <input
            type="nome"
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

        <div className={styles.buttonGroup}>
          <button type="submit" style ={{
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
      }}>Cadastrar</button>
        </div>
        <div className="input-group">
          <button style={{
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
          }} onClick={() => { route.push('/Login') }}>Voltar</button>
        </div>
      </form>
    </div>
  );
};

export default Cadastrar;