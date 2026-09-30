import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    apiRequest
} from "../api";


function Profile() {

    const [employee, setEmployee] =
        useState(null);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        loadProfile();

    }, []);


    async function loadProfile() {

        try {

            const data =
                await apiRequest(
                    "/employee/profile"
                );


            setEmployee(
                data.employee
            );

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    }


    if (loading) {

        return (
            <div className="page">
                Loading profile...
            </div>
        );
    }


    if (error) {

        return (
            <div className="page">

                <div className="error">
                    {error}
                </div>

            </div>
        );
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
                        Profile
                    </Link>

                    <Link to="/leave">
                        Leave
                    </Link>

                </div>

            </nav>


            <main className="page">

                <div className="profile-card">

                    <h1>
                        Employee Profile
                    </h1>


                    <div className="profile-grid">

                        <div>
                            <strong>
                                Employee ID
                            </strong>

                            <span>
                                {employee.empid}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Name
                            </strong>

                            <span>
                                {employee.name}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Email
                            </strong>

                            <span>
                                {employee.email}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Department
                            </strong>

                            <span>
                                {employee.department}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Designation
                            </strong>

                            <span>
                                {employee.designation}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Basic Salary
                            </strong>

                            <span>
                                ₹
                                {employee.basicSalary?.toFixed(2)}
                            </span>
                        </div>


                        <div>
                            <strong>
                                HRA
                            </strong>

                            <span>
                                ₹
                                {employee.hra?.toFixed(2)}
                            </span>
                        </div>


                        <div>
                            <strong>
                                DA
                            </strong>

                            <span>
                                ₹
                                {employee.da?.toFixed(2)}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Gross Salary
                            </strong>

                            <span>
                                ₹
                                {employee.grossSalary?.toFixed(2)}
                            </span>
                        </div>


                        <div>
                            <strong>
                                PF
                            </strong>

                            <span>
                                ₹
                                {employee.pf?.toFixed(2)}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Tax
                            </strong>

                            <span>
                                ₹
                                {employee.tax?.toFixed(2)}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Net Salary
                            </strong>

                            <span>
                                ₹
                                {employee.netSalary?.toFixed(2)}
                            </span>
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}


export default Profile;