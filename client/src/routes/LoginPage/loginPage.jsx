import React, { useState } from 'react';
import './loginPage.scss';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        console.log('It works');
        setIsLoading(true);
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");
        const dob = formData.get("dob");
        const year = parseInt(formData.get("year"), 10);

        try {
            const res = await fetch("http://localhost:8800/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ username, dob, year })
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }

            const data = await res.json();
            console.log(data);
            navigate("/");
        } catch (err) {
            console.log(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <form className="form-container" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <label htmlFor="username">Enter your Username [Roll Number]</label>
                <input type="text" id="username" placeholder="22CSEB01" name="username" />
                <label htmlFor="dob">Date Of Birth</label>
                <input type="date" id="dob" name="dob" />
                <label htmlFor="year">Year</label>
                <input type="number" id="year" placeholder="1/2/3/4" name="year" />
                {error && <span>{error}</span>}
                <button type="submit" disabled={isLoading}>Login</button>
                {isLoading && <p>Loading...</p>}
            </form>
        </div>
    );
}

export default LoginPage;
