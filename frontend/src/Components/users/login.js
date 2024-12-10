import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoadingComponent from "../Alert/LoadingComponent";
import SuccessMsg from "../Alert/SuccessMsg";
import ErrorMsg from "../Alert/ErrorMessage";
import { loginAction, resetState } from "../../Redux/userslices";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    email: "@example.com",
    password: "12345",
  });

  const { userAuth, loading, error, success } = useSelector(
    (state) => state.users
  );

  // Clear localStorage and reset Redux state
  useEffect(() => {
    localStorage.removeItem("userInfo");
    dispatch(resetState());
  }, [dispatch]);

  // Redirect if authenticated
  useEffect(() => {
    if (userAuth?.userInfo?.token) {
      console.log("Redirecting to profile...");
      navigate("/user-profile");
    }
  }, [userAuth?.userInfo?.token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      loginAction({
        email: formData.email,
        password: formData.password,
      })
    );
    setFormData({ email: "", password: "" });
    
  };

  return (
    <section className="py-16 xl:pb-56 bg-white overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-md mx-auto">
          <h2 className="mb-4 text-6xl md:text-7xl text-center font-bold font-heading tracking-px-n leading-tight">
            Login to your account
          </h2>
          <p className="mb-12 font-medium text-lg text-gray-600 leading-normal">
            Enter your details below.
          </p>
          {error && <ErrorMsg message={error?.message} />}
          {success && <SuccessMsg message="Logged in Successfully" />}
          <form onSubmit={handleSubmit}>
            <label className="block mb-5">
              <input
                className="px-4 py-3.5 w-full text-gray-500 font-medium placeholder-gray-500 bg-white outline-none border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label className="block mb-5">
              <input
                className="px-4 py-3.5 w-full text-gray-500 font-medium placeholder-gray-500 bg-white outline-none border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                type="password"
                placeholder="Enter Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>
            {loading ? (
              <LoadingComponent />
            ) : (
              <button
                className="mb-8 py-4 px-9 w-full text-white font-semibold border border-indigo-700 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition ease-in-out duration-200"
                type="submit"
              >
                Login
              </button>
            )}
            <p className="font-medium">
              <span className="m-2">Forgot Password?</span>
              <Link className="text-indigo-600 hover:text-indigo-700" to="/forgot-password">
                Reset Password
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
