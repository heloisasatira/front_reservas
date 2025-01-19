'use client';
import styles from './page.module.css';

const Perfil = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img 
            src="https://i.pinimg.com/736x/78/3c/18/783c184b8b9254dbdea43190c462a25d.jpg" 
            alt="Logo do Restaurante" 
            className={styles.logo} 
          />
        </div>
        <div className={styles.headerActions}>
          <button className={styles.ctaButton}>Faça sua Reserva</button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.left}>
          <p>Bem-vindo(a)! Um mundo de possibilidades espera por você.</p>
        </div>
        <div className={styles.right}>
          <p>Pronto para começar? Faça login abaixo.</p>
          <a href="/Login" className={styles.loginBtn}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
