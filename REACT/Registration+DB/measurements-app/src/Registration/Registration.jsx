import { useState } from 'react';
import './authentication.css';

function Registration({ onLogin }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {

        event.preventDefault();

        setMessage('');
        setLoading(true);

        try {

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            onLogin(data.user);

        } catch (error) {

            setMessage(error.message || 'Ошибка авторизации');

        } finally {

            setLoading(false);

        }
    }

    return (

        <div className="entrance">

            <div className="entrance-bar">

                <h2 className="textGeo">
                    Geo Assistant
                </h2>

                <h3>Login</h3>

                <form onSubmit={handleLogin}>

                    <p className="textSubmit">
                        E-mail:
                    </p>

                    <input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <p className="textSubmit">
                        Password:
                    </p>

                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        id="buttonSubmit"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>

                    {message && (
                        <p className="auth-message">
                            {message}
                        </p>
                    )}

                </form>

            </div>

        </div>

    );
}

export default Registration;