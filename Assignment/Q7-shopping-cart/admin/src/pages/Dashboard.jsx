import { Link, useNavigate } from "react-router-dom";


function Dashboard() {

    const navigate = useNavigate();


    const admin =
        JSON.parse(
            localStorage.getItem(
                "admin"
            ) || "{}"
        );


    const logout = () => {

        localStorage.removeItem(
            "adminToken"
        );

        localStorage.removeItem(
            "admin"
        );

        navigate("/login");
    };


    return (

        <div>

            <nav className="navbar">

                <h2>
                    Shopping Admin
                </h2>


                <div>

                    <Link to="/">
                        Dashboard
                    </Link>

                    {" | "}

                    <Link to="/categories">
                        Categories
                    </Link>

                    {" | "}

                    <Link to="/products">
                        Products
                    </Link>

                    {" "}

                    <button
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            <div className="container">

                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    Welcome, {admin.name}
                </p>


                <div className="grid">

                    <Link
                        to="/categories"
                        className="dashboard-card"
                    >

                        <h2>
                            Categories
                        </h2>

                        <p>
                            Manage two-level categories.
                        </p>

                    </Link>


                    <Link
                        to="/products"
                        className="dashboard-card"
                    >

                        <h2>
                            Products
                        </h2>

                        <p>
                            Add, edit and delete products.
                        </p>

                    </Link>

                </div>

            </div>

        </div>

    );
}


export default Dashboard;