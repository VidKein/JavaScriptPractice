import Button from "./component/button"
import Header from "./component/heder"
import './styles/button.css';
import './styles/heder.css';
import imgVite from "./assets/vite.svg"

const App = function App() {  
  return (
  <>
    {/*Компоненты*/}
    <Header img={imgVite}/>{/*PROOPS*/}
    <Button/>
  </>
  )

}
export default App