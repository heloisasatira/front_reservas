'use client';
import styles from './page.module.css';

const Perfil = () => {
    return (
        <div>
            
            <header className={styles.header}>
                <img src="https://i.pinimg.com/736x/78/3c/18/783c184b8b9254dbdea43190c462a25d.jpg" className={styles.logo} />
                <h1 className={styles.headerTitle}></h1>
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
