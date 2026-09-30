import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";

function Leave() {

    const [date, setDate] = useState("");

    const [reason, setReason] = useState("");

    const [grant, setGrant] = useState("No");

    const [leaves, setLeaves] = useState([]);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");


    useEffect(() => {

        loadLeaves();

    }, []);


    const loadLeaves = async () => {

        try {

            const data =
                await apiRequest("/leaves");

            setLeaves(data);

        } catch (error) {

            setError(error.message);
        }
    };


    const addLeave = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        if (!date || !reason) {

            setError(
                "Date and reason are required."
            );

            return;
        }


        try {

            await apiRequest(
                "/leaves",
                {
                    method: "POST",

                    body: JSON.stringify({
                        date,
                        reason,
                        grant
                    })
                }
            );


            setMessage(
                "Leave application added successfully."
            );


            setDate("");

            setReason("");

            setGrant("No");

            loadLeaves();

        } catch (error) {

            setError(error.message);
        }
    };


    return (

        <div className="page">

            <div className="card">

                <Link to="/home">
                    ← Back to Home
                </Link>


                <h2>
                    Leave Application
                </h2>


                <form onSubmit={addLeave}>

                    <div className="form-group">

                        <label>
                            Date
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Reason
                        </label>

                        <textarea
                            value={reason}
                            onChange={(e) =>
                                setReason(e.target.value)
                            }
                            placeholder="Enter leave reason"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Grant
                        </label>

                        <select
                            value={grant}
                            onChange={(e) =>
                                setGrant(e.target.value)
                            }
                        >

                            <option value="Yes">
                                Yes
                            </option>

                            <option value="No">
                                No
                            </option>

                        </select>

                    </div>


                    <button type="submit">
                        Add Leave
                    </button>

                </form>


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


                <hr />


                <h3>
                    Leave List
                </h3>


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

                        </tr>

                    </thead>


                    <tbody>

                        {leaves.length === 0 ? (

                            <tr>

                                <td colSpan="3">
                                    No leave applications found.
                                </td>

                            </tr>

                        ) : (

                            leaves.map((leave) => (

                                <tr key={leave._id}>

                                    <td>
                                        {new Date(
                                            leave.date
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>
                                        {leave.reason}
                                    </td>

                                    <td>
                                        {leave.grant}
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );
}

export default Leave;