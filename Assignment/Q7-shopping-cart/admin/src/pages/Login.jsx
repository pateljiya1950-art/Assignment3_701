import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiRequest } from "../api";


function Login() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");


    const handleLogin =
        async (e) => {

            e.preventDefault();

            setError("");


            try {

                const data =
                    await apiRequest(
                        "/auth/login",
                        {
                            method: "POST",

                            body:
                                JSON.stringify({
                                    email,
                                    password
                                })
                        }
                    );


                if (
                    data.user.role !==
                    "admin"
                ) {

                    setError(
                        "This account is not an admin account."
                    );

                    return;
                }


                localStorage.setItem(
                    "adminToken",
                    data.token
                );


                localStorage.setItem(
                    "admin",
                    JSON.stringify(
                        data.user
                    )
                );


                navigate("/");

            } catch (error) {

                setError(
                    error.message
                );
            }
        };


    return (

        <div className="login-page">

            <div className="login-card">

                <h1>
                    Admin Login
                </h1>


                <form
                    onSubmit={handleLogin}
                >

                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={
                            e =>
                                setEmail(
                                    e.target.value
                                )
                        }
                    />


                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={
                            e =>
                                setPassword(
                                    e.target.value
                                )
                        }
                    />


                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}


                    <button>
                        Login
                    </button>

                </form>

            </div>

        </div>

    );
}


export default Login;