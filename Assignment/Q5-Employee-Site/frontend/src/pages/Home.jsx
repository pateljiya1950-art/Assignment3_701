import {
    Link,
    useNavigate
} from "react-router-dom";


function Home() {

    const navigate =
        useNavigate();


    const employee =
        JSON.parse(
            localStorage.getItem(
                "employee"
            ) || "{}"
        );


    function logout() {

        localStorage.removeItem(
            "employeeToken"
        );

        localStorage.removeItem(
            "employee"
        );

        navigate("/login");
    }


    return (

        <div>

            <nav className="navbar">

                <div className="logo">
                    ERP Employee
                </div>


                <div className="nav-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/profile">
                        Page 1 - Profile
                    </Link>

                    <Link to="/leave">
                        Page 2 - Leave
                    </Link>

                    <button
                        onClick={logout}
                        className="logout-button"
                    >
                        Logout
                    </button>

                </div>

            </nav>


            <main className="home-container">

                <div className="welcome-card">

                    <h1>
                        Welcome, {employee.name}
                    </h1>

                    <p>
                        Employee ID:
                        <strong>
                            {" "}{employee.empid}
                        </strong>
                    </p>

                    <div className="home-links">

                        <Link
                            to="/profile"
                            className="home-card"
                        >

                            <h2>
                                Page 1
                            </h2>

                            <p>
                                Display Employee
                                Profile
                            </p>

                        </Link>


                        <Link
                            to="/leave"
                            className="home-card"
                        >

                            <h2>
                                Page 2
                            </h2>

                            <p>
                                Apply and view
                                leave applications
                            </p>

                        </Link>

                    </div>

                </div>

            </main>

        </div>
    );
}


export default Home;