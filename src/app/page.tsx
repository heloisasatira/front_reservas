'use client';
import styles from './page.module.css';

const Perfil = () => {
    return (
        <div>
            
{/*             <header className={styles.header}>
                <img src="https://i.pinimg.com/736x/78/3c/18/783c184b8b9254dbdea43190c462a25d.jpg" className={styles.logo} />
                <h1 className={styles.headerTitle}></h1>
            </header>
 */}

<header className="restaurant-header">
  <div className="header-logo">
    <img src="https://i.pinimg.com/736x/78/3c/18/783c184b8b9254dbdea43190c462a25d.jpg" alt="Logo do Restaurante" className={styles.logo}/>
  </div>
 {/*  <nav className="header-nav">
    <ul>
      <li><a href="#home">Início</a></li>
      <li><a href="#menu">Cardápio</a></li>
      <li><a href="#reservas">Reservas</a></li>
      <li><a href="#contato">Contato</a></li>
    </ul>
  </nav> */}
  <div className="header-actions">
    <button className="cta-button">Faça sua Reserva</button>
  </div>
</header>
        
            <div className={styles.content}>
                <div className={styles.left}>
                    <p>Bem-vindo(a)! Um mundo de possibilidades espera por você.
                    </p>
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