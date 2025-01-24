'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const Perfil = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bem-vindo(a) ao Painel de Controle</h1>
      <div className={styles.cardContainer}>
        {/* Card de Cadastro de Mesas */}
        <div
          className={styles.card}
          onClick={() => router.push('/mesas')}
        >
          <h2>Cadastrar Mesas</h2>
          <p>Gerencie e cadastre novas mesas para o restaurante.</p>
        </div>

        {/* Card de Visualização de Perfil */}
        <div
          className={styles.card}
          onClick={() => router.push('/Perfil')}
        >
          <h2>Visualizar Perfil</h2>
          <p>Veja e edite as informações do seu perfil.</p>
        </div>

        <div
          className={styles.card}
          onClick={() => router.push('/Adm')}
        >
          <h2>Visualizar Reservas</h2>
          <p>Veja as informações das reservas cadastradas.</p>
        </div>
      </div>
    </div>
  );
};

export default Perfil;