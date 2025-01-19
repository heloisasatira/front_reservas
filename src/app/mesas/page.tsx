'use client';
import styles from "./page.module.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from 'nookies';
import { ApiURL } from "../Config";
import Titulo from "../components/titulo";
import { Mesa } from "../interfaces/mesa";

const CadastrarMesa = () => {
  const [mesa, setMesa] = useState<Mesa>({
    id: 0,
    n_lugares: 0,
    codigo: "",
  });

  const [mesasCadastradas, setMesasCadastradas] = useState<Mesa[]>([]);
  const [msgError, setMsgError] = useState('');
  const [msgSuccess, setMsgSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMsgError('');
    setMsgSuccess('');
  
    try {
      const { 'restaurant-token': token } = parseCookies();
  
      // Excluindo o campo `id` antes de enviar
      const { id, ...mesaSemId } = mesa;
  
      const response = await fetch(`${ApiURL}/mesas/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(mesaSemId),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || 'Erro ao cadastrar a mesa.');
      }
  
      const novaMesa = await response.json();
      setMesasCadastradas((prevMesas) => [...prevMesas, novaMesa]); // Atualizar estado apenas com dados válidos
      setMsgSuccess('Mesa cadastrada com sucesso!');
      setMesa({ id: 0, n_lugares: 0, codigo: "" });
    } catch (error: any) {
      console.error('Erro ao cadastrar mesa:', error);
      setMsgError(error.message || 'Erro no servidor. Por favor, tente novamente mais tarde.');
    }
  };
  
  const alterarMesa = <K extends keyof Mesa>(key: K, value: Mesa[K]) => {
    setMesa((prevMesa) => ({
      ...prevMesa,
      [key]: value,
    }));
  };

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Titulo titulo="Cadastrar Mesa" />
        {msgError && <p className={styles.error}>{msgError}</p>}
        {msgSuccess && <p className={styles.success}>{msgSuccess}</p>}

        <div className={styles.inputGroup}>
          <input
            type="number"
            placeholder="Número de Lugares"
            value={mesa.n_lugares}
            onChange={(e) => alterarMesa("n_lugares", parseInt(e.target.value))}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Código da Mesa"
            value={mesa.codigo}
            onChange={(e) => alterarMesa("codigo", e.target.value)}
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

        <div className={styles.buttonGroup}>
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
            onClick={() => router.push('/')}
          >
            Voltar
          </button>
        </div>
      </form>

      {mesasCadastradas.length > 0 && (
  <div className={styles.tableContainer}>
    <h2 className={styles.tableTitle}>Mesas Cadastradas</h2>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Código</th>
          <th>Número de Lugares</th>
        </tr>
      </thead>
      <tbody>
        {mesasCadastradas.map((mesa) => (
          <tr key={mesa.id}>
            <td>{mesa.id}</td>
            <td>{mesa.codigo}</td>
            <td>{mesa.n_lugares}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default CadastrarMesa;