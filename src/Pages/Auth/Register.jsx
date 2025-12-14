import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { registerUser, signInGoogle, updateUserProfile } = useAuth();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const handleRegistration = (data) => {
    const profileImg = data.photo[0];
    const fullName = `${data.firstName} ${data.lastName}`;

    registerUser(data.email, data.password)
      .then(() => {
        // Upload image
        const formData = new FormData();
        formData.append('image', profileImg);

        const imageAPIURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_img_host_key}`;

        axios.post(imageAPIURL, formData)
          .then(res => {
            const photoURL = res.data.data.url;

            const userInfo = {
              email: data.email,
              displayName: fullName,
              photoURL: photoURL,
              phone: data.phone || ''
            };

            // Save user to backend
            axiosSecure.post('/users', userInfo)
              .then(res => {
                if (res.data.insertedId) {
                  console.log('User created in database');
                }
              });

            // Update Firebase profile
            updateUserProfile({ displayName: fullName, photoURL })
              .then(() => console.log('Profile updated'))
              .catch(err => console.log(err));
          });

        toast.success("Account created successfully!");
        setTimeout(() => navigate("/"), 2000);
      })
      .catch(err => console.log(err));
  };

  const handleGoogleSignIn = () => {
    signInGoogle()
      .then(result => {
        toast.success("Registered with Google!");
        const userInfo = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        };
        axiosSecure.post('/users', userInfo)
          .then(res => console.log("User saved to DB", res.data));
        setTimeout(() => navigate("/"), 2000);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="w-full justify-center py-3 grid grid-cols-1 lg:ml-20">
      <form onSubmit={handleSubmit(handleRegistration)} className="w-full max-w-md space-y-6 -mt-7">
        <h4 className='text-4xl text-center mb-9 font-bold'>Create an Account</h4>
        <p className='-mt-5 text-center mb-10 font-semibold'>
          Register With <span className='font-bold text-xl'>Create Arena</span>
        </p>

        {/* First & Last Name */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs font-semibold">FIRST NAME</label>
            <input
              type="text"
              {...register('firstName', { required: true })}
              className="w-full border-b border-gray-300 focus:outline-none py-1"
            />
            {errors.firstName && <p className='text-xs text-red-500 mt-1'>First name is required</p>}
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold">LAST NAME</label>
            <input
              type="text"
              {...register('lastName', { required: true })}
              className="w-full border-b border-gray-300 focus:outline-none py-1"
            />
            {errors.lastName && <p className='text-xs text-red-500 mt-1'>Last name is required</p>}
          </div>
        </div>

        {/* Photo */}
        <div>
          <label className="text-xs font-semibold">IMAGE</label>
          <input
            type="file"
            {...register('photo', { required: true })}
            className="w-full border-b border-gray-400 focus:outline-none py-2"
          />
          {errors.photo && <p className='text-xs text-red-500 mt-1'>Image is required</p>}
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold">EMAIL</label>
          <input
            type="email"
            {...register('email', { required: true })}
            className="w-full border-b border-gray-300 focus:outline-none py-1"
          />
          {errors.email && <p className='text-xs text-red-500 mt-1'>Email is required</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-semibold">PHONE NUMBER</label>
          <input
            type="number"
            {...register('phone')}
            className="w-full border-b border-gray-300 focus:outline-none py-1"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="text-xs font-semibold">PASSWORD</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: true,
              minLength: 6,
              pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^(){}[\]_+=\-<>.,;:]).{6,}$/
            })}
            className="w-full border-b border-gray-300 focus:outline-none py-1 pr-10"
          />
          {errors.password?.type === 'required' && <p className='text-xs text-red-500 mt-1'>Password is required</p>}
          {errors.password?.type === 'minLength' && <p className='text-xs text-red-500 mt-1'>Minimum 6 characters</p>}
          {errors.password?.type === 'pattern' && <p className='text-xs text-red-500 mt-1'>Must include uppercase, lowercase, symbol & number</p>}

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 bottom-1 cursor-pointer text-gray-500"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="text-xs font-semibold">CONFIRM PASSWORD</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register('confirmPassword', {
              required: true,
              validate: value => value === password || "Passwords do not match"
            })}
            className="w-full border-b border-gray-300 focus:outline-none py-1 pr-10"
          />
          {errors.confirmPassword && <p className='text-xs text-red-500 mt-1'>{errors.confirmPassword.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-secondary text-white font-semibold rounded-full hover:bg-green-800 transition"
        >
          SUBMIT
        </button>

        <p className='mt-3 text-center'>Already Have an Account? <Link to="/login" className='text-secondary font-bold underline'>Login</Link></p>
        <p className='text-center font-bold text-gray-500'>OR</p>

        {/* Google Sign In */}
        <button onClick={handleGoogleSignIn} className="btn max-w-[450px] rounded-3xl bg-gray-200 text-black border-[#e5e5e5] w-full mt-2 py-2">
          Register with Google
        </button>
      </form>
    </div>
  );
};

export default Register;
