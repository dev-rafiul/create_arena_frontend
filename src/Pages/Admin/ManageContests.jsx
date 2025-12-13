// import { useQuery } from '@tanstack/react-query';
// import React from 'react';
// import useAuth from '../../hooks/useAuth';
// import useAxiosSecure from '../../hooks/useAxiosSecure';



// const ManageContests = () => {
//     const {user} = useAuth()
//     const axiosSecure = useAxiosSecure()

//     const {data: contests = []} = useQuery({
//         queryKey: ['manageUsers', user?.email],
//         queryFn: async() => {
//             const res = await axiosSecure.get(`/contests?email=${user.email}`)
//             return res.data 
//         }
//     })


//     return (
//         <div>
//             <h2>All of My Users {contests.length}</h2>
//             {
//                 contests.map(user => <p>{user.name}</p>)
//             }
//         </div>
//     );
// };

// export default ManageContests;



import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';

const ManageContests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch contests that are in 'pending' state
  const { data: contests = [] } = useQuery({
    queryKey: ['manageContests', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/contests?status=pending`);
      return res.data;
    }
  });

  // Mutation to approve a contest
  const approveContestMutation = useMutation(
    (contestId) => axiosSecure.patch(`/contests/${contestId}`, { status: 'approved' }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['manageContests']); // Refetch contests after approval
        toast.success("Contest Approved Successfully!");
      },
    //   onError: (error) => {
    //     toast.error("Failed to approve contest");
    //   }
    }
  );

  // Mutation to reject a contest
  const rejectContestMutation = useMutation(
    (contestId) => axiosSecure.patch(`/contests/${contestId}`, { status: 'rejected' }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['manageContests']);
        toast.success("Contest Rejected");
      },
    //   onError: (error) => {
    //     toast.error("Failed to reject contest");
    //   }
    }
  );

  // Handle approve action
  const handleApprove = (contestId) => {
    approveContestMutation.mutate(contestId);
  };

  // Handle reject action
  const handleReject = (contestId) => {
    rejectContestMutation.mutate(contestId);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Manage Contests</h2>
      <div className="mt-4">
        {contests.length > 0 ? (
          contests.map((contest) => (
            <div key={contest._id} className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold">{contest.name}</h3>
              <p className="text-sm">Type: {contest.type}</p>
              <p className="text-sm">Price: ${contest.price}</p>
              <p className="text-sm">Prize Money: ${contest.prizeMoney}</p>
              <p className="text-sm">{contest.description}</p>
              <div className="mt-4">
                <button
                  onClick={() => handleApprove(contest._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(contest._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No contests to manage</p>
        )}
      </div>
    </div>
  );
};

export default ManageContests;
