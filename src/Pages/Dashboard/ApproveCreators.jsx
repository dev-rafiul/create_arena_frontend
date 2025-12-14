
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import React, { useState } from 'react'; 
import useAxiosSecure from '../../hooks/useAxiosSecure'; 
import Swal from 'sweetalert2'; 
import { FaUserCheck, FaUserMinus } from "react-icons/fa";
import { GrView } from "react-icons/gr";
const ApproveCreators = () => { 
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

  const queryClient = useQueryClient()
  const axiosSecure = useAxiosSecure(); 
  const [selectedCreator, setSelectedCreator] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

 
const { data: creators = [], isLoading, isError, error } = useQuery({
  queryKey: ['creators'],
  queryFn: async () => {
    const res = await axiosSecure.get('/creator');
    return res.data;
  },
});
        
        const pendingCreators = creators.filter(c => c.status === 'pending');
        const approvedCreators = creators.filter(c => c.status === 'approved');
        const rejectedCreators = creators.filter(c => c.status === 'rejected');

        const totalRequests = creators.length;








const updateRiderStatus = async (creator, status) => {
  const updateInfo = { status: status, email: creator.email };

  const res = await axiosSecure.patch(`/creator/${creator._id}`, updateInfo);

  if (res.data.modifiedCount) {

   

    queryClient.setQueryData(['creators'], (oldData) =>
  oldData.map((c) =>
    c._id === creator._id  
      ? { ...c, status }
      : c
  )
);




    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: `Creator has been ${status}`,
      timer: 2000,
      showConfirmButton: false,
    });
  }
};







const handleApprove = creator => {
  updateRiderStatus(creator, 'approved')
}
const handleReject = creator => {
  updateRiderStatus(creator, 'rejected')
}

  if (isLoading) return <p className="text-center p-8">Loading creator requests...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500 p-8">
        Failed to load creator requests: {error.message}
      </p>
    );


    const handleView = (creator) => {
  setSelectedCreator(creator);
  setIsModalOpen(true);
};


  const StatusCard = ({ title, value, colorClass }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[180px]">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
    </div>
  );




  const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="font-medium text-gray-900">{value}</p>
  </div>
);



const totalPages = Math.ceil(creators.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

const paginatedCreators = creators.slice(startIndex, endIndex);



  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* <h1 className="text-3xl font-semibold mb-6">Manage Creator Requests</h1> */}

      
      <div className="flex flex-wrap gap-4 mb-8">
        <StatusCard 
          title="Pending Requests" 
          value={pendingCreators.length} 
          colorClass="text-yellow-600" 
        />
        <StatusCard 
          title="Approved Requests" 
          value={approvedCreators.length} 
          colorClass="text-gray-800" 
        />
        <StatusCard 
          title="Rejected Requests"
          value={rejectedCreators.length}
          colorClass="text-gray-800"
        />
        <StatusCard 
          title="Total Requests" 
          value={totalRequests} 
          colorClass="text-gray-800" 
        />
      </div>

    
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          Manage Creator Requests ({creators.length})
        </h2>

        {creators.length === 0 ? (
          <p className="py-4 text-center text-gray-600">
            No pending creator requests at this time.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Requested
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* {creators.map((creator) => ( */}
                {paginatedCreators.map((creator) => (

                  <tr key={creator._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {creator.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {creator.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(creator.createdAt).toLocaleDateString()}
                    </td>
                    <td className='text-gray-500 text-sm text-center'>
                      <p className={`${creator.status === 'approved' ? "text-green-800" : "text-red-500"}`}>
                      {creator.status}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-3">
                        <button
  onClick={() => handleView(creator)}
  className="btn"
>
  <GrView />
</button>

                      <button
  onClick={() => handleApprove(creator)}
  disabled={creator.status === 'approved'}
  className={` btn transition
     ${
      creator.status === 'approved'
        ? 'bg-green-600 text-white'
        : 'bg-green-100 text-green-700 hover:bg-green-200'
    }
  `}
  title="Approve Creator"
>
  <FaUserCheck className="text-lg" />
</button>

<button
  onClick={() => handleReject(creator)}
  disabled={creator.status === 'rejected'}
  className={`btn transition
    ${
      creator.status === 'rejected'
        ? 'bg-red-600 text-white'
        : 'bg-red-100 text-red-700 hover:bg-red-200'
    }
  `}
  title="Reject Creator"
>
  <FaUserMinus className="text-lg" />
</button>


                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>




<div className="flex justify-between items-center mt-6">
  <p className="text-sm text-gray-600">
    Page {currentPage} of {totalPages}
  </p>

  <div className="flex gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(prev => prev - 1)}
      className={`px-3 py-1 rounded-md border text-sm ${
        currentPage === 1
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white hover:bg-gray-100'
      }`}
    >
      Prev
    </button>

    {[...Array(totalPages).keys()].map((num) => (
      <button
        key={num}
        onClick={() => setCurrentPage(num + 1)}
        className={`px-3 py-1 rounded-md border text-sm ${
          currentPage === num + 1
            ? 'bg-indigo-600 text-white'
            : 'bg-white hover:bg-gray-100'
        }`}
      >
        {num + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(prev => prev + 1)}
      className={`px-3 py-1 rounded-md border text-sm ${
        currentPage === totalPages
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white hover:bg-gray-100'
      }`}
    >
      Next
    </button>
  </div>
</div>





          </div>
        )}
      </div>




{isModalOpen && selectedCreator && (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">

    
      <div className="bg-gradient-to-r from-indigo-800 to-purple-900 px-6 py-4 flex justify-between items-center">
        <h2 className="text-white text-xl font-semibold">
          Creator Profile
        </h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-white text-2xl hover:opacity-80"
        >
          &times;
        </button>
      </div>

    
      <div className="p-6 space-y-5 text-sm text-gray-700">

      
        <div className="grid grid-cols-2 gap-4">
          <Info label="Name" value={selectedCreator.name || 'N/A'} />
          <Info label="Age" value={selectedCreator.age || 'N/A'} />
        </div>

        <Info label="Email" value={selectedCreator.email} />
        <Info label="Phone" value={selectedCreator.phone || 'N/A'} />
        <Info label="City" value={selectedCreator.city || 'N/A'} />

        <div>
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              selectedCreator.status === 'approved'
                ? 'bg-green-100 text-green-700'
                : selectedCreator.status === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {selectedCreator.status}
          </span>
        </div>

      
        <Info
          label="Requested On"
          value={new Date(selectedCreator.createdAt).toLocaleDateString()}
        />
      </div>

    
      <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default ApproveCreators;
