import { useState } from 'react';

import './Button.css'
/*Компонент ВСТАВКА*/
function Button() {
/*Имя*/    
const [name, setName] = useState('');
/*Массив*/
const [servers, setServers] = useState([

        {
            id: 1,
            name: 'Лена',
        },
        {
            id: 2,
            name: 'Костя',
        },

        {
            id: 3,
            name: 'Honza',
        }

    ]);
 /* Добавление разработчика */
    function addServer() {
        const newServer = {
            id: Date.now(),
            name: name
        };

        setServers((currentServers) => [
            ...currentServers,
            newServer
        ]);
        /* Очищаем input */
        setName('');
    }
    function onDeletePoint(id) {
        setServers((currentServers) =>
            currentServers.filter((server) => server.id !== id)
        );
    }

  return (
    <>
    <hr />
      <p style={{color: "blue"}}>Новый Компонент - Button</p>
      <div>Добавить разработчика</div>
      <input type="text" placeholder="Имя разработчика" value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <button onClick={addServer}>Добавить разработчика</button>      
      <div>Список разработчиков : </div>
      {servers.map((server) => (
                <div className="point" key={server.id}>

                    <strong>{server.name}</strong>

                    <button onClick={() => onDeletePoint(server.id)}>
                        Удалить
                    </button>
                </div>

            ))}
    </>
  )
}

export default Button