'use client'

import React, { useState } from 'react';
import { ApiURL } from "../Config"; 
import styles from './page.module.css';

const ReservaPage = () => {
  const [mesaId, setMesaId] = useState<number>(0);
  const [usuarioId, setUsuarioId] = useState<number>(0);
  const [nPessoas, setNPessoas] = useState<number>(0);
  const [data, setData] = useState<string>('');
  const [mensagem, setMensagem] = useState<string>('');
  const [reservas, setReservas] = useState<Array<any>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mesaId || !usuarioId || !nPessoas || !data) {
      setMensagem('Todos os campos são obrigatórios.');
      return;
    }
    try {
      const response = await fetch(`${ApiURL}/reservas/criar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesaId, usuarioId, n_pessoas: nPessoas, data }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setMensagem(errorData.message || 'Erro ao tentar fazer a reserva');
        return;
      }
      const responseData = await response.json();
      setMensagem(responseData.message);
      setReservas([...reservas, responseData.reserva]);
    } catch (error) {
      setMensagem('Erro ao tentar fazer a reserva');
    }
  };

  const cancelarReserva = async (id: number) => {
    try {
      const response = await fetch(`${ApiURL}/reservas/cancelar`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservaId: id }),
      });
      const responseData = await response.json();
      if (response.status === 200) {
        setMensagem(responseData.message);
        setReservas(reservas.filter((reserva) => reserva.id !== id));
      } else {
        setMensagem(responseData.error || 'Erro ao cancelar reserva');
      }
    } catch (error) {
      setMensagem('Erro ao tentar cancelar a reserva');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.h2}>Fazer Reserva</h2>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="mesaId">Mesa</label>
          <input
            type="number"
            id="mesaId"
            value={mesaId}
            onChange={(e) => setMesaId(Number(e.target.value))}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="usuarioId">Usuário ID</label>
          <input
            type="number"
            id="usuarioId"
            value={usuarioId}
            onChange={(e) => setUsuarioId(Number(e.target.value))}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="nPessoas">Número de Pessoas</label>
          <input
            type="number"
            id="nPessoas"
            value={nPessoas}
            onChange={(e) => setNPessoas(Number(e.target.value))}
            required
          />
        </div>
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
        <button type="submit" className={styles.submitButton}>Reservar</button>
      </form>

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

      {mensagem && <p className={styles.message}>{mensagem}</p>}
    </div>
  );
};

export default ReservaPage;