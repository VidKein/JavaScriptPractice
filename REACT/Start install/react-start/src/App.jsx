import { useState } from 'react'
import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
/*Компонент ВСТАВКА*/
function App() {
  //Работа с состоянием
  const [countPlus, setCountPlus] = useState(0)
  const [countMinus, setCountMinus] = useState(0)
  useEffect(() => {
  alert("Компонент useEffect ПРИ СТАРТЕ был считан");
   }, []);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={reactLogo} className="framework" alt="React logo" />
          <div>+</div>
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Start REACT</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
      
        <button type="button" className="counter"
          onClick={() => setCountPlus((countPlus) => countPlus + 1)}
        >
          Count is  {countPlus}
        </button>
        <button type="button" className="counter"
          onClick={() => setCountMinus((countMinus) => countMinus - 1)}
        >
          Count is  {countMinus}
        </button>
        <button type="button" className="counter"
         onClick={() => alert("Вы нажали кнопку")}>
        Click
        </button>
      </section>
      
    </>
  )
}

export default App
