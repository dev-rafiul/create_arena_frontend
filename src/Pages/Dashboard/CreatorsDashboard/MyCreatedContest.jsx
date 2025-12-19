import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaEye, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyCreatedContest = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedContest, setSelectedContest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);

  
  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["myCreatedContests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-contests?email=${user.email}`
      );
      return res.data;
    }
  });

  
  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      axiosSecure.delete(`/contests/${id}`),
    onSuccess: () => {
      Swal.fire("Deleted!", "Contest deleted successfully", "success");
      queryClient.invalidateQueries(["myCreatedContests"]);
    }
  });

  const handleDelete = (contest) => {
    Swal.fire({
      title: `Delete "${contest.name}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444"
    }).then((res) => {
      if (res.isConfirmed) {
        deleteMutation.mutate(contest._id);
      }
    });
  };


  const updateMutation = useMutation({
    mutationFn: async (updatedData) =>
      
      axiosSecure.patch(
  `/contests/${selectedContest._id}/edit`,
  updatedData
      ),

    onSuccess: () => {
      Swal.fire("Success!", "Contest updated", "success");
      setIsEditOpen(false);
      queryClient.invalidateQueries(["myCreatedContests"]);
    }
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedData = {
      name: form.name.value,
      price: parseFloat(form.price.value),
      prizeMoney: parseFloat(form.prizeMoney.value)
    };

    updateMutation.mutate(updatedData);
  };

  /* ================= FETCH SUBMISSIONS ================= */
  const { data: submissions = [] } = useQuery({
    queryKey: ["contestSubmissions", selectedContest?._id],
    enabled: !!selectedContest?._id && isSubmissionsOpen,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/contests/${selectedContest._id}/submissions`
      );
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10">
          My Created Contests
        </h1>

        <div className="overflow-x-auto bg-white rounded-xl shadow-xl">
          <table className="table w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Entry Fee</th>
                <th>Prize</th>
                <th>Status</th>
                <th>Participants</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {contests.map((contest) => (
                <tr key={contest._id}>
                  <td>
                    <img
                      src={contest.image}
                      alt={contest.name}
                      className="w-14 h-14 rounded object-cover"
                    />
                  </td>

                  <td>
                    <p className="font-bold">{contest.name}</p>
                    <small className="text-gray-500">{contest.type}</small>
                  </td>

                  <td>${contest.price}</td>

                  <td className="text-green-600 font-bold">
                    ${contest.prizeMoney}
                  </td>

                  <td>
                    <span className={`badge ${
                      contest.status === "pending"
                        ? "badge-warning"
                        : contest.status === "approved"
                        ? "badge-success"
                        : "badge-error"
                    }`}>
                      {contest.status === "approved"
                        ? "Confirmed"
                        : contest.status}
                    </span>
                  </td>

                  <td>{contest.participantsCount || 0}</td>

                  <td className="flex gap-2">
                    {/* VIEW DETAILS */}
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => {
                        setSelectedContest(contest);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <FaEye />
                    </button>

                    {/* SEE SUBMISSIONS */}
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setSelectedContest(contest);
                        setIsSubmissionsOpen(true);
                      }}
                    >
                      <FaUsers />
                    </button>

                    {/* EDIT & DELETE ONLY IF PENDING */}
                    {contest.status === "pending" && (
                      <>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => {
                            setSelectedContest(contest);
                            setIsEditOpen(true);
                          }}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleDelete(contest)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= DETAILS MODAL ================= */}
        {isDetailsOpen && selectedContest && (
          <dialog className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-2xl mb-3">
                {selectedContest.name}
              </h3>

              <img
                src={selectedContest.image}
                className="rounded mb-4 w-full h-52 object-cover"
              />

              <p><b>Type:</b> {selectedContest.type}</p>
              <p><b>Description:</b> {selectedContest.description}</p>
              <p><b>Deadline:</b> {new Date(selectedContest.deadline).toLocaleString()}</p>

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}

        {/* ================= EDIT MODAL ================= */}
        {isEditOpen && selectedContest && (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-2xl mb-4">
                Edit Contest
              </h3>

              <form onSubmit={handleUpdate}>
                <input
                  name="name"
                  defaultValue={selectedContest.name}
                  className="input input-bordered w-full mb-3"
                  required
                />

                <input
                  name="price"
                  type="number"
                  defaultValue={selectedContest.price}
                  className="input input-bordered w-full mb-3"
                  required
                />

                <input
                  name="prizeMoney"
                  type="number"
                  defaultValue={selectedContest.prizeMoney}
                  className="input input-bordered w-full mb-4"
                  required
                />

                <div className="modal-action">
                  <button type="submit" className="btn btn-success">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {/* ================= SUBMISSIONS MODAL ================= */}
        {isSubmissionsOpen && selectedContest && (
          <dialog className="modal modal-open">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-2xl mb-4">
                Submissions – {selectedContest.name}
              </h3>

              {submissions.length === 0 && (
                <p className="text-gray-500">No submissions yet.</p>
              )}

              {submissions.map((sub, idx) => (
                <div key={idx} className="border p-3 rounded mb-3">
                  <p><b>Email:</b> {sub.email}</p>

                  {sub.submissions?.map((s, i) => (
                    <p key={i}>
                      🔗{" "}
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Submission
                      </a>
                    </p>
                  ))}
                </div>
              ))}

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setIsSubmissionsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}

      </div>
    </div>
  );
};

export default MyCreatedContest;
