import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);

  const { signInUser, signInGoogle } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleLogin = async (data) => {
    setLoading(true);
    setLoginError("");
    
    try {
      const result = await signInUser(data.email, data.password);
      console.log(result.user);
      navigate(location?.state?.from?.pathname || "/");
    } catch (error) {
      console.log(error);
  
      switch (error.code) {
        case "auth/user-not-found":
          setLoginError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setLoginError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setLoginError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setLoginError("Too many failed attempts. Please try again later.");
          break;
        case "auth/network-request-failed":
          setLoginError("Network error. Please check your connection.");
          break;
        default:
          setLoginError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setLoginError("");
    
    try {
      const result = await signInGoogle();
      console.log(result.user);
      
      const userInfo = {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };

      const res = await axiosSecure.post("/users", userInfo);
      console.log("user data has been stored", res.data);
      
      navigate(location?.state?.from?.pathname || "/");
    } catch (error) {
      console.log(error);
      setLoginError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 justify-center items-center py-10 px-4">
      <title>Log In | Create Arena</title>

      <div className="w-full max-w-md space-y-6 p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h4 className="text-4xl mb-4 font-bold bg-gradient-to-r from-secondary to-green-600 bg-clip-text text-transparent">
            Welcome Back!
          </h4>
          <p className="text-gray-600 font-semibold">
            Login to <span className="font-bold text-xl text-secondary">Create Arena</span>
          </p>
        </div>

    
        {loginError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="text-red-800 text-sm font-medium">{loginError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address"
                }
              })}
              type="email"
              className="w-full border-b px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition duration-200 border-black"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                type={showPassword ? "text" : "password"}
                className="w-full border-b border-black px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L19 19" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password.message}
              </p>
            )}
          </div>

        

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-secondary to-green-600 hover:from-secondary/90 hover:to-green-500 hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <span>LOGIN</span>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-white text-gray-500 font-bold">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full max-w-[450px] mx-auto block py-3 px-6 rounded-3xl border-2 font-semibold transition-all duration-200 flex items-center justify-center space-x-3 mx-auto ${
            loading
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-800 border-gray-200 hover:border-gray-300 hover:shadow-md hover:bg-gray-50"
          }`}
        >
          <svg
            aria-label="Google logo"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="flex-shrink-0"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
              <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
              <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
              <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
            </g>
          </svg>
          <span>{loading ? "Signing in with Google..." : "Continue with Google"}</span>
        </button>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-secondary font-bold hover:text-secondary/80 transition-colors">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
