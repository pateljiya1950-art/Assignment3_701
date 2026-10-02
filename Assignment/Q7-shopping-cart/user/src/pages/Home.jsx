import {
    Link,
    useNavigate
} from "react-router-dom";


function Home() {

    const navigate =
        useNavigate();


    const user =
        JSON.parse(
            localStorage.getItem(
                "user"
            ) || "{}"
        );


    const logout = () => {

        localStorage.removeItem(
            "userToken"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/login");
    };


    return (

        <div>

            <nav className="navbar">

                <h2>
                    My Shopping Store
                </h2>


                <div>

                    <Link to="/">
                        Home
                    </Link>

                    {" | "}

                    <Link to="/products">
                        Products
                    </Link>

                    {" | "}

                    <Link to="/cart">
                        Cart
                    </Link>

                    {" | "}

                    <span>
                        Hello, {user.name}
                    </span>

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
                    Welcome to Our Store
                </h1>

                <p>
                    Browse products and add them to your shopping cart.
                </p>


                <Link
                    to="/products"
                    className="shop-button"
                >
                    View Products
                </Link>

            </div>

        </div>

    );
}


export default Home;