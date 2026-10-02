import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/students";


function App() {

    const [students, setStudents] = useState([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [course, setCourse] = useState("");

    const [editId, setEditId] = useState(null);


    // ==================================
    // GET STUDENTS
    // ==================================

    const getStudents = async () => {

        try {

            const response = await fetch(API_URL);

            const data = await response.json();

            setStudents(data);

        } catch (error) {

            console.error(error);

            alert("Unable to load students");

        }

    };


    // ==================================
    // LOAD STUDENTS
    // ==================================

    useEffect(() => {

        getStudents();

    }, []);


    // ==================================
    // CLEAR FORM
    // ==================================

    const clearForm = () => {

        setName("");
        setEmail("");
        setAge("");
        setCourse("");

        setEditId(null);

    };


    // ==================================
    // ADD / UPDATE
    // ==================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!name || !email || !age || !course) {

            alert("Please fill all fields");

            return;

        }


        const studentData = {

            name: name,

            email: email,

            age: Number(age),

            course: course

        };


        try {

            let response;


            // UPDATE
            if (editId) {

                response = await fetch(
                    `${API_URL}/${editId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(studentData)
                    }
                );

            }

            // ADD
            else {

                response = await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(studentData)
                    }
                );

            }


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Something went wrong"
                );

                return;

            }


            if (editId) {

                alert(
                    "Student updated successfully"
                );

            } else {

                alert(
                    "Student added successfully"
                );

            }


            clearForm();

            getStudents();


        } catch (error) {

            console.error(error);

            alert("Server error");

        }

    };


    // ==================================
    // EDIT
    // ==================================

    const editStudent = (student) => {

        setEditId(student.id);

        setName(student.name);

        setEmail(student.email);

        setAge(student.age);

        setCourse(student.course);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==================================
    // DELETE
    // ==================================

    const deleteStudent = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );


        if (!confirmDelete) {

            return;

        }


        try {

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to delete student"
                );

                return;

            }


            alert(
                "Student deleted successfully"
            );


            getStudents();


        } catch (error) {

            console.error(error);

            alert("Server error");

        }

    };


    return (

        <div className="container">

            <h1>
                Student CRUD Application
            </h1>


            {/* ==========================
                FORM
            =========================== */}

            <div className="form-container">

                <h2>

                    {editId
                        ? "Edit Student"
                        : "Add Student"}

                </h2>


                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                    />


                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                    />


                    <input
                        type="number"
                        placeholder="Enter Age"
                        value={age}
                        onChange={(event) =>
                            setAge(event.target.value)
                        }
                    />


                    <input
                        type="text"
                        placeholder="Enter Course"
                        value={course}
                        onChange={(event) =>
                            setCourse(event.target.value)
                        }
                    />


                    <button type="submit">

                        {editId
                            ? "Update Student"
                            : "Add Student"}

                    </button>


                    {editId && (

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={clearForm}
                        >
                            Cancel
                        </button>

                    )}

                </form>

            </div>


            {/* ==========================
                STUDENT LIST
            =========================== */}

            <div className="table-container">

                <h2>
                    Student List
                </h2>


                <table>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Age</th>

                            <th>Course</th>

                            <th>Actions</th>

                        </tr>

                    </thead>


                    <tbody>

                        {students.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="no-data"
                                >
                                    No students found
                                </td>

                            </tr>

                        ) : (

                            students.map(
                                (student) => (

                                    <tr
                                        key={
                                            student.id
                                        }
                                    >

                                        <td>
                                            {
                                                student.id
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.name
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.email
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.age
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.course
                                            }
                                        </td>

                                        <td>

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    editStudent(
                                                        student
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteStudent(
                                                        student.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}


export default App;