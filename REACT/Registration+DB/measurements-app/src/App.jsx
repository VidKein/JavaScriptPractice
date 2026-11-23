import { useState, useEffect } from 'react';
import Registration from './Registration/Registration';

function App() {

    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    // Проверяем сессию при запуске приложения
    useEffect(() => {

        async function checkSession() {

            try {

                const response = await fetch('/api/auth/me', {
                    credentials: 'same-origin'
                });

                if (!response.ok) {
                    setUser(null);
                    return;
                }

                const data = await response.json();

                setUser(data.user);

            } catch (error) {

                console.error(error);
                setUser(null);

            } finally {

                setChecking(false);

            }
        }

        checkSession();

    }, []);

    // Выход из аккаунта
    async function handleLogout() {

        try {

            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error('Ошибка выхода');
            }

            setUser(null);

        } catch (error) {

            console.error(error);

        }
    }

    // Ожидание проверки сессии
    if (checking) {
        return <p>Проверка авторизации...</p>;
    }

    // Если пользователь не вошёл
    if (!user) {
        return <Registration onLogin={setUser} />;
    }

    // Если пользователь авторизован
    return (

        <div className="mainApp">

            <button onClick={handleLogout}>
                Exit sait
            </button>

            <h1>Geo Assistant</h1>

            <h2>
                Welcome, {user.username}!
            </h2>

            {/* Здесь будет содержимое твоего Geo Assistant */
            <>
                <h1>Hellou</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta sapiente perspiciatis modi fugiat eum, deleniti velit vitae aut nulla voluptates sed quia ullam necessitatibus aperiam earum dolore voluptatibus excepturi quibusdam?</p>
                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea blanditiis amet quidem delectus magni quo, neque ducimus alias repellat iusto nostrum impedit enim qui! Ullam neque voluptatum consequatur similique animi.</div>
            </>
            }

        </div>

    );
}

export default App;