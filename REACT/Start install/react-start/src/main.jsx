import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Header from './components/Header.jsx'/*Компонент файл*/
import Button from './components/Button.jsx'/*Компонент файл*/
/*Компонент УКАЗЫВАЕМ КУДА ВСТАВИТЬ*/
createRoot(document.getElementById('header')).render(
  <StrictMode>
    <Header />
  </StrictMode>,
)
/*Компонент УКАЗЫВАЕМ КУДА ВСТАВИТЬ*/
createRoot(document.getElementById('button')).render(
  <StrictMode>
    <Button />
  </StrictMode>,
)