import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function Login() {

    const navigate = useNavigate();

    const [empid, setEmpid] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        if (!empid || !password) {

            setError(
                "Please enter Employee ID and password."
            );

            return;
        }

        try {

            setLoading(true);

            const data = await apiRequest(
                "/auth/login",
                {
                    method: "POST",

                    body: JSON.stringify({
                        empid,
                        password
                    })
                }
            );


            localStorage.setItem(
                "employeeToken",
                data.token
            );


            localStorage.setItem(
                "employee",
                JSON.stringify(data.employee)
            );


            navigate("/home");

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="login-page">

            <div className="login-card">

                <h1>
                    Employee Login
                </h1>

                <p>
                    Login using your employee credentials.
                </p>


                <form onSubmit={handleLogin}>

                    <label>
                        Employee ID
                    </label>

                    <input
                        type="text"
                        value={empid}
                        onChange={(e) =>
                            setEmpid(e.target.value)
                        }
                        placeholder="EMP1001"
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter password"
                    />


                    {error && (

                        <div className="error">
                            {error}
                        </div>

                    )}


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>

            </div>

        </div>

    );
}

export default Login;