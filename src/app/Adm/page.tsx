'use client'
import React, { useEffect, useState } from 'react';
import { ApiURL } from "../Config";
import styles from './page.module.css';

const AdminPage = () => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [mensagem, setMensagem] = useState<string>('');

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch(`${ApiURL}/reservas/todas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          setMensagem(errorData.error || 'Erro ao obter reservas.');
          return;
        }

        const reservasData = await response.json();
        setReservas(reservasData);
      } catch (error) {
        setMensagem('Erro ao tentar carregar as reservas.');
      }
    };

    fetchReservas();
  }, []);

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.title}>Reservas de Clientes</h1>
      {mensagem && <p className={styles.errorMessage}>{mensagem}</p>}
      <div className={styles.reservasList}>
        {reservas.length === 0 ? (
          <p>Não há reservas no momento.</p>
        ) : (
          reservas.map((reserva) => (
            <div key={reserva.id} className={styles.reservaCard}>
              <p><strong className={styles.strongText}>Mesa:</strong> {reserva.mesaId}</p>
              <p><strong className={styles.strongText}>Usuário:</strong> {reserva.usuario.nome}</p>
              <p><strong className={styles.strongText}>Número de Pessoas:</strong> {reserva.n_pessoas}</p>
              <p><strong className={styles.strongText}>Data:</strong> {new Date(reserva.data).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPage;