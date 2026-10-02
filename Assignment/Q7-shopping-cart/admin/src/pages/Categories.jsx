import { useEffect, useState } from "react";

import { apiRequest } from "../api";


function Categories() {

    const [categories, setCategories] =
        useState([]);

    const [name, setName] =
        useState("");

    const [parent, setParent] =
        useState("");


    const loadCategories =
        async () => {

            try {

                const data =
                    await apiRequest(
                        "/categories"
                    );

                setCategories(data);

            } catch (error) {

                alert(error.message);
            }
        };


    useEffect(() => {

        loadCategories();

    }, []);


    const addCategory =
        async (e) => {

            e.preventDefault();


            if (!name) {

                alert(
                    "Enter category name"
                );

                return;
            }


            try {

                await apiRequest(
                    "/categories",
                    {
                        method: "POST",

                        body:
                            JSON.stringify({
                                name,
                                parent:
                                    parent || null
                            })
                    }
                );


                setName("");

                setParent("");

                loadCategories();

            } catch (error) {

                alert(
                    error.message
                );
            }
        };


    const deleteCategory =
        async (id) => {

            if (
                !window.confirm(
                    "Delete this category?"
                )
            ) {
                return;
            }


            try {

                await apiRequest(
                    `/categories/${id}`,
                    {
                        method: "DELETE"
                    }
                );


                loadCategories();

            } catch (error) {

                alert(
                    error.message
                );
            }
        };


    const parentCategories =
        categories.filter(
            category =>
                category.parent ===
                null
        );


    return (

        <div className="container">

            <h1>
                Category Management
            </h1>


            <div className="form-card">

                <h2>
                    Add Category
                </h2>


                <form
                    onSubmit={addCategory}
                >

                    <input
                        type="text"
                        placeholder="Category name"
                        value={name}
                        onChange={
                            e =>
                                setName(
                                    e.target.value
                                )
                        }
                    />


                    <select
                        value={parent}
                        onChange={
                            e =>
                                setParent(
                                    e.target.value
                                )
                        }
                    >

                        <option value="">
                            Main Category
                        </option>


                        {parentCategories.map(
                            category => (

                                <option
                                    key={
                                        category._id
                                    }
                                    value={
                                        category._id
                                    }
                                >
                                    {
                                        category.name
                                    }
                                </option>

                            )
                        )}

                    </select>


                    <button>
                        Add Category
                    </button>

                </form>

            </div>


            <div className="table-card">

                <h2>
                    Categories
                </h2>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Name
                            </th>

                            <th>
                                Level
                            </th>

                            <th>
                                Parent
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {categories.map(
                            category => (

                                <tr
                                    key={
                                        category._id
                                    }
                                >

                                    <td>
                                        {category.name}
                                    </td>


                                    <td>

                                        {
                                            category.parent
                                                ? "Level 2"
                                                : "Level 1"
                                        }

                                    </td>


                                    <td>

                                        {
                                            category.parent
                                                ? category.parent.name
                                                : "-"
                                        }

                                    </td>


                                    <td>

                                        <button
                                            onClick={() =>
                                                deleteCategory(
                                                    category._id
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

        </div>

    );
}


export default Categories;