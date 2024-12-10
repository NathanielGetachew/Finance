import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createDepositAction } from "../../Redux/userslices"; // Import the deposit action

const DepositForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(""); // Amount to deposit
  const [error, setError] = useState(""); // Error state for validation

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid deposit amount.");
      return;
    }
  
    setError(""); // Clear error
  
    // Assuming the user info is available in the local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  
    if (userInfo) {
      const depositData = {
        amount: parseFloat(amount),
        frequency: "one-time",  // You can modify this to handle frequency if needed
      };
      dispatch(createDepositAction(depositData)); // Dispatch deposit action
      closeModal(); // Close the deposit form after submission
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Make a Deposit</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="amount">
              Deposit Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter deposit amount"
              min="0"
              step="any"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Deposit
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositForm;
