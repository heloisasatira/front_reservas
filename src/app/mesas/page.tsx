'use client';
import styles from "./page.module.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from 'nookies';
import { ApiURL } from "../Config";
import Titulo from "../components/titulo";
import { Mesa } from "../interfaces/mesa";

const CadastrarMesa = () => {
  // Componente principal da página para cadastrar mesas.

  const [mesa, setMesa] = useState<Mesa>({
    id: 0,
    n_lugares: 0,
    codigo: "",
  });
  // Aqui se usa o `useState` para armazenar os dados da mesa que está sendo cadastrada
  // O estado inicial tem um `id` (0), número de lugares (`n_lugares`: 0), e um código vazio.

  const [mesasCadastradas, setMesasCadastradas] = useState<Mesa[]>([]);
  // Outro estado, uma lista para armazenar todas as mesas já cadastradas.

  const [msgError, setMsgError] = useState('');
  const [msgSuccess, setMsgSuccess] = useState('');
  //mais dois estados para guardar mensagens de erro e sucesso, que serão exibidas na interface

  const router = useRouter();
  // Hook do Next.js que ajuda a navegar para outras páginas.

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMsgError('');
    setMsgSuccess('');
    // previne o comportamento padrão do formulário (recarregar a página) e limpa as mensagens

    try {
      const { 'restaurant-token': token } = parseCookies();
      // Lê o token de autenticação salvo nos cookies.

      const { id, ...mesaSemId } = mesa;
      // Remove a propriedade `id` do objeto `mesa` antes de enviar para a API.

      const response = await fetch(`${ApiURL}/mesas/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(mesaSemId),
      });
      // Faz uma requisição POST para a API, enviando os dados da mesa sem o `id`.

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || 'Erro ao cadastrar a mesa.');
        // Se a resposta não for "ok", lança um erro com a mensagem da API ou uma genérica.
      }

      const novaMesa = await response.json();
      setMesasCadastradas((prevMesas) => [...prevMesas, novaMesa]);
      // Adiciona a nova mesa na lista de mesas cadastradas.

      setMsgSuccess('Mesa cadastrada com sucesso!');
      setMesa({ id: 0, n_lugares: 0, codigo: "" });
      // Mostra uma mensagem de sucesso e reseta os campos do formulário.
    } catch (error: any) {
      console.error('Erro ao cadastrar mesa:', error);
      setMsgError(error.message || 'Erro no servidor. Por favor, tente novamente mais tarde.');
      // Mostra a mensagem de erro caso algo dê errado.
    }
  };

  const alterarMesa = <K extends keyof Mesa>(key: K, value: Mesa[K]) => {
    setMesa((prevMesa) => ({
      ...prevMesa,
      [key]: value,
    }));
  };
  // Função para alterar uma propriedade específica do estado `mesa`, sem sobrescrever o restante.

  const handlePositiveNumber = (value: string, key: keyof Mesa) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      alterarMesa(key, numValue as Mesa[typeof key]);
    }
  };
  // Valida se o número é positivo antes de atualizar o estado.

  return (
    <div className={styles.page}>
      {/* Estrutura principal da página. Usa o estilo importado. */}
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Formulário principal, chama `handleSubmit` ao enviar. */}
        <Titulo titulo="Cadastrar Mesa" />
        {/* Exibe o título usando o componente customizado. */}
        {msgError && <p className={styles.error}>{msgError}</p>}
        {msgSuccess && <p className={styles.success}>{msgSuccess}</p>}
        {/* Mostra mensagens de erro ou sucesso, se existirem. */}

        <div className={styles.inputGroup}>
          <input
            type="number"
            placeholder="Número de Lugares"
            value={mesa.n_lugares}
            onChange={(e) => handlePositiveNumber(e.target.value, "n_lugares")}
            min="1"
            required
          />
          {/* Input para o número de lugares da mesa. Valida se é um número positivo. */}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Código da Mesa"
            value={mesa.codigo}
            onChange={(e) => alterarMesa("codigo", e.target.value)}
            required
          />
          {/* Input para o código da mesa. Atualiza diretamente o estado. */}
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
              justifyContent: 'center',
            }}
          >
            Cadastrar Mesa
          </button>
          {/* Botão estilizado para enviar o formulário. */}
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
              justifyContent: 'center',
            }}
            onClick={() => router.push('/')}
          >
            Voltar
          </button>
          {/* Botão estilizado para voltar para a página inicial. */}
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
      {/* Se existirem mesas cadastradas, exibe uma tabela com elas. */}
    </div>
  );
};

export default CadastrarMesa;
// Exporta o componente para ser usado em outras partes da aplicação.