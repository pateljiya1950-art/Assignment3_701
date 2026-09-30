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


function Leave() {

    const [date, setDate] =
        useState("");

    const [reason, setReason] =
        useState("");

    const [grant, setGrant] =
        useState("No");


    const [leaves, setLeaves] =
        useState([]);


    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    useEffect(() => {

        loadLeaves();

    }, []);


    async function loadLeaves() {

        try {

            const data =
                await apiRequest(
                    "/leaves"
                );


            setLeaves(
                data.leaves
            );

        } catch (error) {

            setError(
                error.message
            );
        }
    }


    async function handleSubmit(e) {

        e.preventDefault();

        setMessage("");

        setError("");

        setLoading(true);


        try {

            const data =
                await apiRequest(
                    "/leaves",
                    {
                        method: "POST",

                        body:
                            JSON.stringify({
                                date,
                                reason,
                                grant
                            })
                    }
                );


            setMessage(
                data.message
            );


            setDate("");

            setReason("");

            setGrant("No");


            await loadLeaves();

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    }


    async function deleteLeave(id) {

        const confirmed =
            window.confirm(
                "Delete this leave application?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const data =
                await apiRequest(
                    `/leaves/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            setMessage(
                data.message
            );


            await loadLeaves();

        } catch (error) {

            setError(
                error.message
            );
        }
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

                <h1>
                    Leave Application
                </h1>


                {message && (

                    <div className="success">
                        {message}
                    </div>

                )}


                {error && (

                    <div className="error">
                        {error}
                    </div>

                )}


                <div className="leave-grid">

                    {/* ADD LEAVE */}

                    <div className="form-card">

                        <h2>
                            Apply for Leave
                        </h2>


                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <label>
                                Date
                            </label>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    setDate(
                                        e.target.value
                                    )
                                }
                                required
                            />


                            <label>
                                Reason
                            </label>

                            <textarea
                                value={reason}
                                onChange={(e) =>
                                    setReason(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter reason"
                                rows="5"
                                required
                            />


                            <label>
                                Grant
                            </label>

                            <select
                                value={grant}
                                onChange={(e) =>
                                    setGrant(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="Yes">
                                    Yes
                                </option>

                                <option value="No">
                                    No
                                </option>

                            </select>


                            <button
                                type="submit"
                                disabled={loading}
                            >

                                {loading
                                    ? "Adding..."
                                    : "Add Leave"}

                            </button>

                        </form>

                    </div>


                    {/* LIST LEAVE */}

                    <div className="list-card">

                        <h2>
                            Leave Applications
                        </h2>


                        {leaves.length === 0 ? (

                            <p>
                                No leave applications
                                found.
                            </p>

                        ) : (

                            <div className="leave-table-container">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Reason
                                            </th>

                                            <th>
                                                Grant
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {leaves.map(
                                            (leave) => (

                                                <tr
                                                    key={
                                                        leave._id
                                                    }
                                                >

                                                    <td>
                                                        {new Date(
                                                            leave.date
                                                        ).toLocaleDateString()}
                                                    </td>

                                                    <td>
                                                        {
                                                            leave.reason
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            leave.grant
                                                        }
                                                    </td>

                                                    <td>

                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                deleteLeave(
                                                                    leave._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}


export default Leave;