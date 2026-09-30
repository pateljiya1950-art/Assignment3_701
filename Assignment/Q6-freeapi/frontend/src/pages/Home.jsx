import { Link, useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    const employee =
        JSON.parse(
            localStorage.getItem("employee") || "{}"
        );


    const logout = () => {

        localStorage.removeItem("employeeToken");

        localStorage.removeItem("employee");

        navigate("/login");
    };


    return (

        <div className="home-page">

            <nav className="navbar">

                <h2>
                    Employee Portal
                </h2>


                <div className="nav-links">

                    <Link to="/home">
                        Home
                    </Link>

                    <Link to="/profile">
                        Profile
                    </Link>

                    <Link to="/leave">
                        Leave
                    </Link>

                    <Link to="/currency">
                        Currency Converter
                    </Link>

                    <button onClick={logout}>
                        Logout
                    </button>

                </div>

            </nav>


            <div className="home-content">

                <h1>
                    Welcome, {employee.name}
                </h1>

                <p>
                    Employee ID: {employee.empid}
                </p>


                <div className="dashboard-grid">


                    <Link
                        to="/profile"
                        className="dashboard-card"
                    >

                        <h3>
                            Employee Profile
                        </h3>

                        <p>
                            View your employee details.
                        </p>

                    </Link>


                    <Link
                        to="/leave"
                        className="dashboard-card"
                    >

                        <h3>
                            Leave Application
                        </h3>

                        <p>
                            Apply for leave and view leave records.
                        </p>

                    </Link>


                    <Link
                        to="/currency"
                        className="dashboard-card"
                    >

                        <h3>
                            Currency Converter
                        </h3>

                        <p>
                            Convert currencies using a free API.
                        </p>

                    </Link>


                </div>

            </div>

        </div>

    );
}

export default Home;