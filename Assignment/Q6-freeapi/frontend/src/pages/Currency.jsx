import { useState } from "react";
import { apiRequest } from "../api";

function Currency() {

    const [amount, setAmount] = useState("");

    const [from, setFrom] = useState("USD");

    const [to, setTo] = useState("INR");

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    const convertCurrency = async (e) => {

        e.preventDefault();

        setError("");
        setResult(null);

        if (!amount || Number(amount) <= 0) {

            setError("Please enter a valid amount.");

            return;
        }

        try {

            setLoading(true);

            const data = await apiRequest(
                `/currency/convert?amount=${amount}&from=${from}&to=${to}`
            );

            setResult(data);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="page">

            <div className="card currency-card">

                <h2>Currency Converter</h2>

                <p>
                    Convert currency using a free exchange-rate API.
                </p>


                <form onSubmit={convertCurrency}>

                    <div className="form-group">

                        <label>
                            Amount
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                            placeholder="Enter amount"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            From Currency
                        </label>

                        <select
                            value={from}
                            onChange={(e) =>
                                setFrom(e.target.value)
                            }
                        >

                            <option value="USD">
                                USD - US Dollar
                            </option>

                            <option value="INR">
                                INR - Indian Rupee
                            </option>

                            <option value="EUR">
                                EUR - Euro
                            </option>

                            <option value="GBP">
                                GBP - British Pound
                            </option>

                            <option value="AUD">
                                AUD - Australian Dollar
                            </option>

                            <option value="CAD">
                                CAD - Canadian Dollar
                            </option>

                            <option value="JPY">
                                JPY - Japanese Yen
                            </option>

                            <option value="CHF">
                                CHF - Swiss Franc
                            </option>

                            <option value="CNY">
                                CNY - Chinese Yuan
                            </option>

                        </select>

                    </div>


                    <div className="form-group">

                        <label>
                            To Currency
                        </label>

                        <select
                            value={to}
                            onChange={(e) =>
                                setTo(e.target.value)
                            }
                        >

                            <option value="INR">
                                INR - Indian Rupee
                            </option>

                            <option value="USD">
                                USD - US Dollar
                            </option>

                            <option value="EUR">
                                EUR - Euro
                            </option>

                            <option value="GBP">
                                GBP - British Pound
                            </option>

                            <option value="AUD">
                                AUD - Australian Dollar
                            </option>

                            <option value="CAD">
                                CAD - Canadian Dollar
                            </option>

                            <option value="JPY">
                                JPY - Japanese Yen
                            </option>

                            <option value="CHF">
                                CHF - Swiss Franc
                            </option>

                            <option value="CNY">
                                CNY - Chinese Yuan
                            </option>

                        </select>

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Converting..."
                            : "Convert Currency"
                        }

                    </button>

                </form>


                {error && (

                    <div className="error">
                        {error}
                    </div>

                )}


                {result && (

                    <div className="result-box">

                        <h3>
                            Conversion Result
                        </h3>

                        <div className="conversion-result">

                            <strong>
                                {result.amount} {result.from}
                            </strong>

                            <span>
                                =
                            </span>

                            <strong>
                                {Number(result.result).toFixed(2)}
                                {" "}
                                {result.to}
                            </strong>

                        </div>


                        <p>
                            Exchange Rate:
                            {" "}
                            1 {result.from}
                            {" = "}
                            {Number(result.rate).toFixed(6)}
                            {" "}
                            {result.to}
                        </p>


                        {result.date && (

                            <p>
                                Rate Date: {result.date}
                            </p>

                        )}

                    </div>

                )}

            </div>

        </div>

    );
}

export default Currency;