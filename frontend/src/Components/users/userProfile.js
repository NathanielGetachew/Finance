import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReportsAction, getDepositsAction } from "../../Redux/userslices";
import DepositForm from "./depositForm";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userAuth, reports, deposits, loading, error } = useSelector(
    (state) => state.users
  );

  const [showDepositForm, setShowDepositForm] = useState(false); // To toggle the deposit form modal

  useEffect(() => {
    if (userAuth?.userInfo) {
      dispatch(getReportsAction(userAuth.userInfo._id));
      dispatch(getDepositsAction(userAuth.userInfo._id));
    }
  }, [dispatch, userAuth]);

  const handleDepositButtonClick = () => {
    setShowDepositForm(true); // Show the deposit form when the button is clicked
  };

  const closeDepositForm = () => {
    setShowDepositForm(false); // Close the deposit form when the user is done
  };

  if (loading) return <div>Loading...</div>;

  if (error) {
    const errorMessage =
      typeof error === "string" ? error : error?.message || "An unexpected error occurred.";
    return <div>Error: {errorMessage}</div>;
  }

  

  return (
    <div className="container mx-auto p-6">
      {/* Profile Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {userAuth.userInfo.name}!</h1>
          <p className="text-gray-600">Email: {userAuth.userInfo.email}</p>
        </div>
        <div className="relative">
          <img
            src={userAuth.userInfo.profilePicture || "/default-profile.jpg"}
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
        </div>
      </div>

      {/* Make Deposit Button */}
      <button
        onClick={handleDepositButtonClick}
        className="bg-green-500 text-white px-4 py-2 rounded mb-6"
      >
        Make a Deposit
      </button>

      {/* Show Deposit Form Modal */}
      {showDepositForm && <DepositForm closeModal={closeDepositForm} />}

      {/* Reports Section */}
      <h2 className="text-xl font-bold mb-4 text-green-600">Your Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports?.map((report) => (
          <div
            key={report._id}
            className="bg-white shadow-md rounded p-4 border border-gray-200"
          >
            <h3 className="font-bold text-lg">Report ID: {report._id}</h3>
            <p>Total Deposits: ${report.totalDeposits.toFixed(2)}</p>
            <p>Total Interest: ${report.totalInterest.toFixed(2)}</p>
            <p>Remaining Amount: ${report.remainingAmount.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Deposits Table */}
      <h2 className="text-xl font-bold mt-8 mb-4">Your Deposits</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {deposits?.map((deposit) => (
            <tr key={deposit._id}>
              <td className="px-4 py-2 border">${deposit.amount.toFixed(2)}</td>
              <td className="px-4 py-2 border">{new Date(deposit.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserProfile;
