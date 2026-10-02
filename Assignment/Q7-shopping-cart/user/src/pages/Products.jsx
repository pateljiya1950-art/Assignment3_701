import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import { apiRequest } from "../api";


function Products() {

    const [products, setProducts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [selectedCategory, setSelectedCategory] =
        useState("");


    const loadData =
        async () => {

            try {

                const productData =
                    selectedCategory
                        ? await apiRequest(
                            `/products/category/${selectedCategory}`
                        )
                        : await apiRequest(
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

    }, [selectedCategory]);


    const addToCart =
        async (productId) => {

            try {

                await apiRequest(
                    "/cart/add",
                    {
                        method: "POST",

                        body:
                            JSON.stringify({
                                productId,
                                quantity: 1
                            })
                    }
                );


                alert(
                    "Product added to cart"
                );

            } catch (error) {

                alert(
                    error.message
                );
            }
        };


    return (

        <div>

            <nav className="navbar">

                <h2>
                    Products
                </h2>


                <div>

                    <Link to="/">
                        Home
                    </Link>

                    {" | "}

                    <Link to="/cart">
                        Cart
                    </Link>

                </div>

            </nav>


            <div className="container">

                <h1>
                    Products
                </h1>


                <select
                    value={selectedCategory}
                    onChange={
                        e =>
                            setSelectedCategory(
                                e.target.value
                            )
                    }
                >

                    <option value="">
                        All Categories
                    </option>


                    {categories.map(
                        category => (

                            <option
                                key={
                                    category._id
                                }
                                value={
                                    category._id
                                }
                            >

                                {category.parent
                                    ? `${category.parent.name} → ${category.name}`
                                    : category.name
                                }

                            </option>

                        )
                    )}

                </select>


                <div className="product-grid">

                    {products.map(
                        product => (

                            <div
                                className="product-card"
                                key={
                                    product._id
                                }
                            >

                                {product.image && (

                                    <img
                                        src={
                                            product.image
                                        }
                                        alt={
                                            product.name
                                        }
                                    />

                                )}


                                <h3>
                                    {product.name}
                                </h3>


                                <p>
                                    {
                                        product.description
                                    }
                                </p>


                                <h3>
                                    ₹{product.price}
                                </h3>


                                <p>
                                    Stock:
                                    {" "}
                                    {product.stock}
                                </p>


                                <button
                                    disabled={
                                        product.stock === 0
                                    }
                                    onClick={() =>
                                        addToCart(
                                            product._id
                                        )
                                    }
                                >

                                    {product.stock === 0
                                        ? "Out of Stock"
                                        : "Add to Cart"
                                    }

                                </button>

                            </div>

                        )
                    )}

                </div>

            </div>

        </div>

    );
}


export default Products;