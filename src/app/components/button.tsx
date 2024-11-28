
type ButtonProp = {
  funcao:() => void
}


const Button:React.FC<ButtonProp> = ({funcao})=>{
    return ( <button style = {{width : '100px', height: '20px', backgroundColor: '#ff0084', borderRadius: '5px'}} onClick={funcao}>Entrar</button>)
}
 
export default Button; 