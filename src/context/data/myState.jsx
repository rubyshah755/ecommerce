import { useState } from 'react'
import MyContext from './myContext'

function myState(props) {
    const [mode, setMode] = useState('Light');

    const toogleMode = () =>{
      if(mode ==='Light'){
        setMode('dark');
        document.body.style.backgroundColor = "rgb(17, 24, 39)"
      }
      else{
        setMode('Light');
        document.body.style.backgroundColor = "white"
      }
    }
    
  return (
    <MyContext.Provider value={{mode, toggleMode}}>
        {props.children}
    </MyContext.Provider >
  )
}

export default myState