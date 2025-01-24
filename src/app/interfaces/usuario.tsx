interface Usuario {
    id?: number,
    nome: string,
    password: string,
    tipo: 'cliente' | 'admin',
    email?: string
}

/* //intitula que todos os usuarios devem seguir ao objeto Usuario
const PerfilUsuario: React.FC<({usuario: Usuario})> = ({usuario}) => {
    return(
        <div>
            <h1>Perfil Usuario</h1>
            <p>Nome: {usuario.nome}</p>
            <p>Idade: {usuario.idade}</p>
            {usuario.email && <p>Email: {usuario.email}</p>}
        </div>

    )
}; */

export default Usuario;