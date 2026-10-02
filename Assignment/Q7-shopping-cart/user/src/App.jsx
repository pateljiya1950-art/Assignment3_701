import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";


function ProtectedRoute({
    children
}) {

    const token =
        localStorage.getItem(
            "userToken"
        );


    if (!token) {

        return (
            <Navigate
                to="/login"
            />
        );
    }


    return children;
}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />


                <Route
                    path="/register"
                    element={
                        <Register />
                    }
                />


                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <Products />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}


export default App;