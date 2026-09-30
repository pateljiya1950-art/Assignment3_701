import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Leave from "./pages/Leave";
import Currency from "./pages/Currency";


function ProtectedRoute({ children }) {

    const token =
        localStorage.getItem("employeeToken");

    if (!token) {

        return <Navigate to="/login" replace />;
    }

    return children;
}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Login */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* Home */}

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />


                {/* Profile */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />


                {/* Leave */}

                <Route
                    path="/leave"
                    element={
                        <ProtectedRoute>
                            <Leave />
                        </ProtectedRoute>
                    }
                />


                {/* Q6 Currency */}

                <Route
                    path="/currency"
                    element={
                        <ProtectedRoute>
                            <Currency />
                        </ProtectedRoute>
                    }
                />


                {/* Default */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;