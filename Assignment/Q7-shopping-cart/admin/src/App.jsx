import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";


function ProtectedRoute({
    children
}) {

    const token =
        localStorage.getItem(
            "adminToken"
        );


    return token
        ? children
        : <Navigate to="/login" />;
}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute>
                            <Categories />
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