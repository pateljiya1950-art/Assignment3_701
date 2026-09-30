import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";

function Profile() {

    const [employee, setEmployee] = useState(null);

    const [error, setError] = useState("");

    useEffect(() => {

        loadProfile();

    }, []);


    const loadProfile = async () => {

        try {

            const data =
                await apiRequest(
                    "/employee/profile"
                );

            setEmployee(data);

        } catch (error) {

            setError(error.message);
        }
    };


    if (error) {

        return (
            <div className="page">
                <div className="error">
                    {error}
                </div>
            </div>
        );
    }


    if (!employee) {

        return (
            <div className="page">
                Loading profile...
            </div>
        );
    }


    return (

        <div className="page">

            <div className="card">

                <Link to="/home">
                    ← Back to Home
                </Link>

                <h2>
                    Employee Profile
                </h2>


                <div className="profile-grid">

                    <p>
                        <strong>
                            Employee ID:
                        </strong>

                        {employee.empid}
                    </p>


                    <p>
                        <strong>
                            Name:
                        </strong>

                        {employee.name}
                    </p>


                    <p>
                        <strong>
                            Email:
                        </strong>

                        {employee.email}
                    </p>


                    <p>
                        <strong>
                            Department:
                        </strong>

                        {employee.department}
                    </p>


                    <p>
                        <strong>
                            Designation:
                        </strong>

                        {employee.designation}
                    </p>


                    <p>
                        <strong>
                            Basic Salary:
                        </strong>

                        ₹{employee.basicSalary}
                    </p>


                    <p>
                        <strong>
                            HRA:
                        </strong>

                        ₹{employee.hra}
                    </p>


                    <p>
                        <strong>
                            DA:
                        </strong>

                        ₹{employee.da}
                    </p>


                    <p>
                        <strong>
                            Gross Salary:
                        </strong>

                        ₹{employee.grossSalary}
                    </p>


                    <p>
                        <strong>
                            PF:
                        </strong>

                        ₹{employee.pf}
                    </p>


                    <p>
                        <strong>
                            Tax:
                        </strong>

                        ₹{employee.tax}
                    </p>


                    <p>
                        <strong>
                            Net Salary:
                        </strong>

                        ₹{employee.netSalary}
                    </p>

                </div>

            </div>

        </div>

    );
}

export default Profile;