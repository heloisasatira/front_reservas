type TituloProp = {
    titulo: string
}


const Titulo:React.FC<TituloProp> = ({titulo})=>{
    return (<h3 style={{color:'pink'}} >{titulo}</h3>)
}

export default Titulo; 