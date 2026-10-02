import {
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import { apiRequest } from "../api";


function Cart() {

    const [cart, setCart] =
        useState(null);


    const loadCart =
        async () => {

            try {

                const data =
                    await apiRequest(
                        "/cart"
                    );

                setCart(data);

            } catch (error) {

                alert(
                    error.message
                );
            }
        };


    useEffect(() => {

        loadCart();

    }, []);


    const updateQuantity =
        async (
            productId,
            quantity
        ) => {

            try {

                const data =
                    await apiRequest(
                        "/cart/update",
                        {
                            method: "PUT",

                            body:
                                JSON.stringify({
                                    productId,
                                    quantity
                                })
                        }
                    );


                setCart(data);

            } catch (error) {

                alert(
                    error.message
                );

                loadCart();
            }
        };


    const removeItem =
        async (productId) => {

            try {

                const data =
                    await apiRequest(
                        `/cart/remove/${productId}`,
                        {
                            method: "DELETE"
                        }
                    );


                setCart(data);

            } catch (error) {

                alert(
                    error.message
                );
            }
        };


    const clearCart =
        async () => {

            try {

                const data =
                    await apiRequest(
                        "/cart/clear",
                        {
                            method: "DELETE"
                        }
                    );


                setCart(data);

            } catch (error) {

                alert(
                    error.message
                );
            }
        };


    if (!cart) {

        return (
            <div className="container">
                Loading cart...
            </div>
        );
    }


    const total =
        cart.items.reduce(
            (sum, item) => {

                return sum +
                    (
                        item.product.price *
                        item.quantity
                    );

            },
            0
        );


    return (

        <div>

            <nav className="navbar">

                <h2>
                    Shopping Cart
                </h2>


                <Link to="/">
                    Home
                </Link>

            </nav>


            <div className="container">

                <h1>
                    My Cart
                </h1>


                {cart.items.length === 0 ? (

                    <div>

                        <p>
                            Your cart is empty.
                        </p>

                        <Link to="/products">
                            Continue Shopping
                        </Link>

                    </div>

                ) : (

                    <>

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
                                        Quantity
                                    </th>

                                    <th>
                                        Total
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {cart.items.map(
                                    item => (

                                        <tr
                                            key={
                                                item.product._id
                                            }
                                        >

                                            <td>
                                                {
                                                    item.product.name
                                                }
                                            </td>


                                            <td>
                                                ₹
                                                {
                                                    item.product.price
                                                }
                                            </td>


                                            <td>

                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product._id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                >
                                                    -
                                                </button>


                                                {" "}

                                                {item.quantity}

                                                {" "}


                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product._id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </td>


                                            <td>
                                                ₹
                                                {
                                                    (
                                                        item.product.price *
                                                        item.quantity
                                                    ).toFixed(2)
                                                }
                                            </td>


                                            <td>

                                                <button
                                                    onClick={() =>
                                                        removeItem(
                                                            item.product._id
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>


                        <div className="cart-total">

                            <h2>
                                Grand Total:
                                {" "}
                                ₹{total.toFixed(2)}
                            </h2>


                            <button
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>

                        </div>

                    </>

                )}

            </div>

        </div>

    );
}


export default Cart;