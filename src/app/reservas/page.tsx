'use client';
import React, { useState, useEffect } from 'react';
import { ApiURL } from '../Config';

interface Reserva {
  id: number;
  mesaId: number;
  data: string;
  usuarioId: number;
  n_pessoas: number;
}

const ReservaPage: React.FC = () => {
  const [mesaId, setMesaId] = useState<number | ''>('');
  const [nPessoas, setNPessoas] = useState<number | ''>('');
  const [data, setData] = useState<string>('');
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [mensagem, setMensagem] = useState<string>('');

  const fetchReservas = async () => {
    try {
      const response = await fetch(`${ApiURL}/reservas/minhas-reservas`);
      const data = await response.json();

      if (response.ok) {
        setReservas(data);
      } else {
        setMensagem(data.error || 'Erro ao buscar reservas.');
      }
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      setMensagem('Erro ao buscar reservas.');
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ApiURL}/reservas/criar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesaId, n_pessoas: nPessoas, data }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMensagem(responseData.message);
        fetchReservas();
      } else {
        setMensagem(responseData.error || 'Erro ao criar reserva.');
      }
    } catch (error) {
      console.error('Erro ao tentar criar reserva:', error);
      setMensagem('Erro ao tentar criar reserva.');
    }
  };

  const cancelarReserva = async (id: number) => {
    try {
      const response = await fetch(`${ApiURL}/reservas/cancelar`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservaId: id }),
      });

      if (response.ok) {
        setReservas((prevReservas) => prevReservas.filter((r) => r.id !== id));
        setMensagem('Reserva cancelada com sucesso.');
      } else {
        const errorData = await response.json();
        setMensagem(errorData.error || 'Erro ao cancelar reserva.');
      }
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      setMensagem('Erro ao cancelar reserva.');
    }
  };

  return (
    <div>
      <h1>Fazer Reserva</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="mesaId">Mesa</label>
          <input
            type="number"
            id="mesaId"
            value={mesaId}
            onChange={(e) => setMesaId(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="nPessoas">Número de Pessoas</label>
          <input
            type="number"
            id="nPessoas"
            value={nPessoas}
            onChange={(e) => setNPessoas(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="data">Data e Hora</label>
          <input
            type="datetime-local"
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reservar</button>
      </form>

      {mensagem && <p>{mensagem}</p>}

      <h2>Minhas Reservas</h2>
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            Mesa: {reserva.mesaId}, Data: {new Date(reserva.data).toLocaleString()}
            <button onClick={() => cancelarReserva(reserva.id)}>Cancelar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservaPage;