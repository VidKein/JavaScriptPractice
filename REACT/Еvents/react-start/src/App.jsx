import Button from "./component/button"
import Header from "./component/heder"
import Window1 from "./component/windows1"
import Window2 from "./component/windows2"
import './styles/button.css';
import './styles/heder.css';
import './styles/window1.css'

const App = function App() {  
  return (
  <>
    {/*Компоненты*/}
    <Header/>
    <Button/>
    <Window1/>
    <br />
    <Window2/>
  </>
  )

}
export default App