import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    apiRequest
} from "../api";


function Login() {

    const navigate =
        useNavigate();


    const [empid, setEmpid] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    async function handleSubmit(e) {

        e.preventDefault();

        setError("");

        setLoading(true);


        try {

            const data =
                await apiRequest(
                    "/auth/login",
                    {
                        method: "POST",

                        body:
                            JSON.stringify({
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
                JSON.stringify(
                    data.employee
                )
            );


            navigate("/");

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    }


    return (

        <div className="login-page">

            <div className="login-card">

                <h1>
                    Employee Login
                </h1>

                <p>
                    ERP Employee Portal
                </p>


                {error && (

                    <div className="error">
                        {error}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                >

                    <label>
                        Employee ID
                    </label>

                    <input
                        type="text"
                        placeholder="EMP1234"
                        value={empid}
                        onChange={(e) =>
                            setEmpid(
                                e.target.value
                            )
                        }
                        required
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        required
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>

            </div>

        </div>
    );
}


export default Login;