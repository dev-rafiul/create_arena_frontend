import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const CreatorAccess = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    document.title = "Creator Access | Create Arena";
    checkApplicationStatus();
  }, []);


  const checkApplicationStatus = async () => {
    try {
      const res = await axiosSecure.get('/user');
      const creators = res.data;
      
      
      const userEmail = localStorage.getItem('userEmail') || 
                       JSON.parse(localStorage.getItem('user') || '{}')?.email;
      
      const userApplication = creators.find(c => c.email === userEmail);
      
      if (userApplication) {
        setHasApplied(true);
        if (userApplication.status === 'approved') {
          Swal.fire({
            icon: 'success',
            title: 'Already Approved!',
            text: 'You are already a Creator!',
            timer: 2500,
            position: 'top-end'
          });
        } else if (userApplication.status === 'rejected') {
          Swal.fire({
            icon: 'info',
            title: 'Request Rejected',
            text: 'Your previous request was rejected. Contact admin.',
            timer: 3000
          });
        }
      }
    } catch (error) {
      console.error('Error checking application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatorAccess = async (data) => {
    const creatorRequest = {
      ...data,
      status: "pending",
      createdAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/creator", creatorRequest);

      if (res.data.insertedId) {
        setHasApplied(true);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Creator Role Application has been Submitted!",
          text: "We will reach out within 7 working days",
          showConfirmButton: false,
          timer: 2500,
        });
        reset();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed!',
        text: error.response?.data?.message || 'Something went wrong',
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white shadow-xl p-6 rounded-xl">
        <h4 className="text-3xl text-center font-bold mb-6">
          Apply for Creator Role
        </h4>

        {hasApplied ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              ✅
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Application Submitted!
            </h3>
            <p className="text-gray-600 mb-4">
              Your request is under review. Admin will contact you within 7 working days.
            </p>
            <button
              onClick={checkApplicationStatus}
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
            >
              Check Status
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleCreatorAccess)}
            className="space-y-5"
          >
            {[
              { label: "CREATOR NAME", name: "name", type: "text" },
              { label: "CREATOR EMAIL", name: "email", type: "email" },
              { label: "PHONE NUMBER", name: "phone", type: "number" },
              { label: "CREATOR AGE", name: "age", type: "number" },
              { label: "YOUR CITY", name: "city", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs font-semibold">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  {...register(field.name, { required: true })}
                  className="w-full border-b border-gray-300 focus:outline-none py-1 mt-1"
                />
                {errors[field.name] && (
                  <p className="text-xs text-red-500 mt-1">
                    {field.label} is required
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="text-xs font-semibold">
                Short Bio / Interests
              </label>
              <textarea
                rows="3"
                {...register("description", { required: true })}
                className="w-full border-b border-gray-300 focus:outline-none py-1 mt-1"
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  Description is required
                </p>
              )}
            </div>

            <button
  type="submit"
  disabled={hasApplied}
  className={`w-full py-2 font-semibold rounded-full transition 
    ${hasApplied 
      ? "bg-gray-400 cursor-not-allowed" 
      : "bg-emerald-600 hover:bg-emerald-700 text-white"}
  `}
>
  {hasApplied ? "Already Applied" : "Apply For Creator Role"}
</button>

          </form>
        )}
      </div>
    </div>
  );
};

export default CreatorAccess;
