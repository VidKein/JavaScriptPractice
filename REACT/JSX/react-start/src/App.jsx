
const uzerName = "Konstantin";
const namber = 2;

const isLogggetIn = false; 

const App = function App() {
  let na;
  if (namber > 3) {
    na = "отлично";
  } else {
     na = "плохо";
  }

  const plans = [
    "Van",
    "Tu",
    "Fri"
  ];
    const plansComponent = [
    "Van",
    "Tu",
    "Fri"
  ];

  const Component = ()=>
      <ul>
          {plansComponent.map((plan)=> <li key={plan}>{plan}</li>)}
     </ul>
  
  return (
  <>
  {/*Это коментарии*/}
    <div>
      <h1>Hello,{uzerName}</h1>
      <p>{na}</p>
    </div>
    <p>{namber}</p>
    <p>{new Date().toLocaleDateString()}</p>
    <hr />
    <label htmlFor="email">Email:</label>
    <input id='email' type="text" required/>

    {/*Атрибуты*/}
    <p className="red">Красный</p> 
    <p style={{color : "blue"}}> Голубой</p>

    {/*Условия*/}
    {isLogggetIn && <p>{uzerName} актуализирован</p>}
    {isLogggetIn ? <p>{uzerName} актуализирован</p> : <button> Log in</button>}

    {/*Массивы*/}  
    <ul>
          {plans.map((plan)=> <li key={plan}>{plan}</li>)}
    </ul>

    {/*Компоненты*/}
    <Component/>

  </>
  )

}
export default App