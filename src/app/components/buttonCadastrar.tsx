
type ButtonProp = {
    funcao:() => void
  }
  
  
  const ButtonCadastro:React.FC<ButtonProp> = ({funcao})=>{
      return ( <button style = {{width : '100px', height: '20px', backgroundColor: '#ff0084', borderRadius: '5px'}} onClick={funcao}>Cadastrar</button>)
  }
   
  export default ButtonCadastro; 