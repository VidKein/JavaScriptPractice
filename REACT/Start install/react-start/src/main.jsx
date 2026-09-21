import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'/*Компонент файл*/
import Button from './button.jsx'/*Компонент файл*/
/*Компонент УКАЗЫВАЕМ КУДА ВСТАВИТЬ*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
/*Компонент УКАЗЫВАЕМ КУДА ВСТАВИТЬ*/
createRoot(document.getElementById('button')).render(
  <StrictMode>
    <Button />
  </StrictMode>,
)