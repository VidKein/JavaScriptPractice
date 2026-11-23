import { LanguageProvider } from "./LanguageContext";
import LanguageSelect from "./component/LanguageSelect";
import Main from "./component/main"
import Window1 from "./component/windows1"
import Window2 from "./component/windows2"
import './styles/button.css';
import './styles/heder.css';
import './styles/window1.css'

const App = function App() {  
  return (
  <>    
    {/*Компоненты*/}
    <LanguageProvider>
      <LanguageSelect />
       <Main/>
       <br />
       <Window1/>
       <br />
       <Window2/>
    </LanguageProvider>
  </>
  )

}
export default App