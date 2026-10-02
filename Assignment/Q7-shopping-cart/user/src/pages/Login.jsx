import { useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { apiRequest } from "../api";


function Login() {

    const navigate = useNavigate();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");


    const login =
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


                localStorage.setItem(
                    "userToken",
                    data.token
                );


                localStorage.setItem(
                    "user",
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

        <div className="auth-page">

            <div className="auth-card">

                <h1>
                    User Login
                </h1>


                <form
                    onSubmit={login}
                >

                    <input
                        type="email"
                        placeholder="Email"
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


                <p>
                    New user?
                    {" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>

            </div>

        </div>

    );
}


export default Login;