import { useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { apiRequest } from "../api";


function Register() {

    const navigate = useNavigate();


    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");


    const register =
        async (e) => {

            e.preventDefault();


            try {

                await apiRequest(
                    "/auth/register",
                    {
                        method: "POST",

                        body:
                            JSON.stringify({
                                name,
                                email,
                                password
                            })
                    }
                );


                alert(
                    "Registration successful"
                );


                navigate("/login");

            } catch (error) {

                alert(
                    error.message
                );
            }
        };


    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1>
                    Create Account
                </h1>


                <form
                    onSubmit={register}
                >

                    <input
                        placeholder="Name"
                        value={name}
                        onChange={
                            e =>
                                setName(
                                    e.target.value
                                )
                        }
                    />


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


                    <button>
                        Register
                    </button>

                </form>


                <p>
                    Already registered?
                    {" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>

        </div>

    );
}


export default Register;