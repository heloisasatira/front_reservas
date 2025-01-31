'use client'

import React, { useState } from 'react';
import { ApiURL } from "../Config"; // URL base da API onde vamos mandar e receber dados.
import styles from './page.module.css'; // Importando o estilo bonitinho da página.
import { useRouter } from "next/navigation"; // Para navegar entre as páginas.

const ReservaPage = () => {
  // Aqui começam os estados (onde guardamos os dados da página).
  const [mesaId, setMesaId] = useState<number>(0); // Guarda o ID da mesa que queremos reservar.
  const [usuarioId, setUsuarioId] = useState<number>(0); // ID do usuário que tá fazendo a reserva.
  const [nPessoas, setNPessoas] = useState<number>(0); // Quantidade de pessoas na reserva.
  const [data, setData] = useState<string>(''); // A data e hora da reserva.
  const [mensagem, setMensagem] = useState<string>(''); // Mensagens de erro ou sucesso.
  const [reservas, setReservas] = useState<Array<any>>([]); // Lista de reservas já feitas.

  const router = useRouter(); // Usado pra navegar de uma página pra outra.

  // Essa função é só pra garantir que os números digitados (mesaId, etc.) sejam positivos.
  const handlePositiveNumber = (value: string, setter: React.Dispatch<React.SetStateAction<number>>) => {
    const numValue = Number(value); // Transforma a string em número.
    if (numValue > 0) { // Só aceita números positivos.
      setter(numValue); // Atualiza o estado com o número.
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o formulário de recarregar a página (ninguém quer isso, né?).
    
    // Se faltar algum campo obrigatório, manda uma mensagem pro usuário.
    if (!mesaId || !usuarioId || !nPessoas || !data) {
      setMensagem('Todos os campos são obrigatórios.'); // Mensagem de erro.
      return; // Sai daqui, porque não dá pra continuar sem esses dados.
    }

    try {
      // Fazendo um POST pra API com os dados da reserva.
      const response = await fetch(`${ApiURL}/reservas/criar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Dizendo que o conteúdo é JSON
        body: JSON.stringify({ mesaId, usuarioId, n_pessoas: nPessoas, data }), // enviando os dados.
      });

      if (!response.ok) { // Se deu erro na resposta...
        const errorData = await response.json(); // Pega a mensagem de erro da API.
        setMensagem(errorData.message || 'Erro ao tentar fazer a reserva'); // Mostra na tela.
        return;
      }

      // Se deu tudo certo, pega a resposta da API.
      const responseData = await response.json();
      setMensagem(responseData.message); // Mostra a mensagem de sucesso.
      setReservas([...reservas, responseData.reserva]); // Adiciona a nova reserva na lista.
    } catch (error) {
      // Se deu erro no processo (tipo a API caiu), mostra uma mensagem genérica.
      setMensagem('Erro ao tentar fazer a reserva');
    }
  };

  // Essa função cancela uma reserva existente.
  const cancelarReserva = async (id: number) => {
    try {
      // Mandando um DELETE pra API com o ID da reserva.
      const response = await fetch(`${ApiURL}/reservas/cancelar`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservaId: id }), // Dizendo qual reserva apagar (a partir do id).
      });

      const responseData = await response.json(); // Pega a resposta.
      if (response.status === 200) { // Se deu certo (status 200)...
        setMensagem(responseData.message); // Mostra a mensagem de sucesso.
        setReservas(reservas.filter((reserva) => reserva.id !== id)); // Remove a reserva da lista.
      } else {
        setMensagem(responseData.error || 'Erro ao cancelar reserva'); // Mostra o erro.
      }
    } catch (error) {
      // Se der erro na tentativa de cancelar, aparece essa mensagem.
      setMensagem('Erro ao tentar cancelar a reserva');
    }
  };

  // Aqui começa o que aparece na tela.
  return (
    <div className={styles.pageContainer}>
      {/* Título da página */}
      <h2 className={styles.h2}>Fazer Reserva</h2>

      {/* Formulário pra criar reservas */}
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {/* Campo pra informar o ID da mesa */}
        <div className={styles.formGroup}>
          <label htmlFor="mesaId">Mesa</label>
          <input
            type="number"
            id="mesaId"
            value={mesaId}
            min="1" // Garante que só aceita números positivos.
            onChange={(e) => handlePositiveNumber(e.target.value, setMesaId)}
            required
          />
        </div>

        {/* Campo pra informar o ID do usuário */}
        <div className={styles.formGroup}>
          <label htmlFor="usuarioId">Usuário ID</label>
          <input
            type="number"
            id="usuarioId"
            value={usuarioId}
            min="1"
            onChange={(e) => handlePositiveNumber(e.target.value, setUsuarioId)}
            required
          />
        </div>

        {/* Número de pessoas na reserva */}
        <div className={styles.formGroup}>
          <label htmlFor="nPessoas">Número de Pessoas</label>
          <input
            type="number"
            id="nPessoas"
            value={nPessoas}
            min="1"
            onChange={(e) => handlePositiveNumber(e.target.value, setNPessoas)}
            required
          />
        </div>

        {/* Data e hora da reserva */}
        <div className={styles.formGroup}>
          <label htmlFor="data">Data e Hora</label>
          <input
            type="datetime-local"
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </div>

        {/* Botão pra enviar o formulário */}
        <button type="submit" className={styles.submitButton}>Reservar</button>

        {/* Botão pra voltar pra outra página */}
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
      </form>

      {/* Lista de reservas já feitas */}
      <h2 className={styles.h2}>Minhas Reservas</h2>
      <div className={styles.reservasContainer}>
        {reservas.map((reserva) => (
          <div key={reserva.id} className={styles.reservaCard}>
            <p>Mesa {reserva.mesaId} para {reserva.n_pessoas} pessoas</p>
            <p>{new Date(reserva.data).toLocaleString()}</p>
            <button
              onClick={() => cancelarReserva(reserva.id)}
              className={styles.cancelButton}
            >
              Cancelar Reserva
            </button>
          </div>
        ))}
      </div>

      {/* Mostra mensagens de erro ou sucesso */}
      {mensagem && <p className={styles.message}>{mensagem}</p>}
    </div>
  );
};

export default ReservaPage; // Exportando o componente pra ser usado em outros lugares.