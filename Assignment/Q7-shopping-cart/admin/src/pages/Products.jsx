import { useEffect, useState } from "react";

import { apiRequest } from "../api";


function Products() {

    const [products, setProducts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [price, setPrice] =
        useState("");

    const [image, setImage] =
        useState("");

    const [stock, setStock] =
        useState("");

    const [category, setCategory] =
        useState("");


    const loadData =
        async () => {

            try {

                const productData =
                    await apiRequest(
                        "/products"
                    );

                const categoryData =
                    await apiRequest(
                        "/categories"
                    );


                setProducts(
                    productData
                );

                setCategories(
                    categoryData
                );

            } catch (error) {

                alert(
                    error.message
                );
            }
        };


    useEffect(() => {

        loadData();

    }, []);


    const addProduct =
        async (e) => {

            e.preventDefault();


            if (
                !name ||
                !price ||
                !stock ||
                !category
            ) {

                alert(
                    "Please fill all required fields"
                );

                return;
            }


            try {

                await apiRequest(
                    "/products",
                    {
                        method: "POST",

                        body:
                            JSON.stringify({
                                name,
                                description,
                                price,
                                image,
                                stock,
                                category
                            })
                    }
                );


                setName("");

                setDescription("");

                setPrice("");

                setImage("");

                setStock("");

                setCategory("");


                loadData();

            } catch (error) {

                alert(
                    error.message
                );
            }
        };


    const deleteProduct =
        async (id) => {

            if (
                !window.confirm(
                    "Delete this product?"
                )
            ) {
                return;
            }


            try {

                await apiRequest(
                    `/products/${id}`,
                    {
                        method: "DELETE"
                    }
                );


                loadData();

            } catch (error) {

                alert(
                    error.message
                );
            }
        };


    return (

        <div className="container">

            <h1>
                Product Management
            </h1>


            <div className="form-card">

                <h2>
                    Add Product
                </h2>


                <form
                    onSubmit={addProduct}
                >

                    <input
                        placeholder="Product Name"
                        value={name}
                        onChange={
                            e =>
                                setName(
                                    e.target.value
                                )
                        }
                    />


                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={
                            e =>
                                setDescription(
                                    e.target.value
                                )
                        }
                    />


                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={
                            e =>
                                setPrice(
                                    e.target.value
                                )
                        }
                    />


                    <input
                        type="text"
                        placeholder="Image URL"
                        value={image}
                        onChange={
                            e =>
                                setImage(
                                    e.target.value
                                )
                        }
                    />


                    <input
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={
                            e =>
                                setStock(
                                    e.target.value
                                )
                        }
                    />


                    <select
                        value={category}
                        onChange={
                            e =>
                                setCategory(
                                    e.target.value
                                )
                        }
                    >

                        <option value="">
                            Select Category
                        </option>


                        {categories.map(
                            item => (

                                <option
                                    key={
                                        item._id
                                    }
                                    value={
                                        item._id
                                    }
                                >

                                    {item.parent
                                        ? `${item.parent.name} → ${item.name}`
                                        : item.name
                                    }

                                </option>

                            )
                        )}

                    </select>


                    <button>
                        Add Product
                    </button>

                </form>

            </div>


            <div className="table-card">

                <h2>
                    Product List
                </h2>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Product
                            </th>

                            <th>
                                Price
                            </th>

                            <th>
                                Category
                            </th>

                            <th>
                                Stock
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {products.map(
                            product => (

                                <tr
                                    key={
                                        product._id
                                    }
                                >

                                    <td>
                                        {product.name}
                                    </td>

                                    <td>
                                        ₹{product.price}
                                    </td>

                                    <td>

                                        {
                                            product.category
                                                ?.name
                                        }

                                    </td>

                                    <td>
                                        {product.stock}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                deleteProduct(
                                                    product._id
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


export default Products;