
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoShieldCheckmark } from "react-icons/io5";
import { FiShieldOff } from "react-icons/fi";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();

  const { refetch, data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users`)
      return res.data
    }
  });


  const { refetch: refetchCreators, data: creators = [] } = useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const res = await axiosSecure.get('/creator');
      return res.data;
    }
  });


  const hasCreatorApplication = (userEmail) => {
    return creators.some(creator => creator.email === userEmail);
  };

  const handleMakeAdmin = user => {
    const roleInfo = { role: 'admin' };
    axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
      .then(res => {
        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            title: `${user.displayName} Marked as an Admin`,
            position: 'top-end',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000
          });
        }
      })
      .catch(err => {
        Swal.fire({
          title: 'Access Denied',
          text: err.response?.data?.message || 'Only original admin can do this',
          icon: 'error',
          timer: 2000
        });
      });
  };

  const handleRemoveAdmin = user => {
    const roleInfo = { role: 'user' };
    axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
      .then(res => {
        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            title: `${user.displayName} removed from Admin`,
            position: 'top-end',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000
          });
        }
      })
      .catch(err => {
        Swal.fire({
          title: 'Access Denied',
          text: err.response?.data?.message || 'Only original admin can do this',
          icon: 'error',
          timer: 2000
        });
      });
  };

  const handleMakeCreator = user => {
    const roleInfo = { role: 'creator' };
    axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
      .then(res => {
        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            title: `${user.displayName} Marked as Creator`,
            position: 'top-end',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000
          });
        }
      })
      .catch(err => {
        Swal.fire({
          title: 'Failed to assign Creator role',
          text: err.response?.data?.message || 'Something went wrong',
          icon: 'error',
          timer: 2000
        });
      });
  };

  const handleRemoveCreator = user => {
    const roleInfo = { role: 'user' };
    axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
      .then(res => {
        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            title: `${user.displayName} removed from Creator`,
            position: 'top-end',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000
          });
        }
      })
      .catch(err => {
        Swal.fire({
          title: 'Failed to remove Creator role',
          text: err.response?.data?.message || 'Something went wrong',
          icon: 'error',
          timer: 2000
        });
      });
  };

  const handleApproveCreatorRequest = async (creator) => {
    Swal.fire({
      title: `Approve ${creator.name}?`,
      text: "This will assign Creator role to this user",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, approve!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updateData = {
          status: 'approved',
          email: creator.email
        };

        try {
          const res = await axiosSecure.patch(`/creator/${creator._id}`, updateData);
          if (res.data.modifiedCount) {
            refetch();
            refetchCreators();
            Swal.fire({
              title: `${creator.name} approved as Creator!`,
              text: 'Creator role assigned successfully',
              icon: 'success',
              position: 'top-end',
              timer: 3000
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Failed to approve',
            text: error.response?.data?.message || 'Something went wrong',
            icon: 'error'
          });
        }
      }
    });
  };

  const handleRejectCreatorRequest = async (creator) => {
    Swal.fire({
      title: `Reject ${creator.name}'s request?`,
      text: "This will mark the request as rejected",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, reject!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/creator/${creator._id}`, { status: 'rejected' });
          if (res.data.modifiedCount) {
            refetchCreators();
            Swal.fire({
              title: `${creator.name}'s request rejected`,
              icon: 'success',
              position: 'top-end',
              timer: 2500
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Failed to reject',
            text: error.response?.data?.message || 'Something went wrong',
            icon: 'error'
          });
        }
      }
    });
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h4 className="text-sm text-gray-500 font-medium">Total Users</h4>
          <p className="text-3xl font-bold text-blue-600 mt-1">{users.length}</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h4 className="text-sm text-gray-500 font-medium">Admins</h4>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h4 className="text-sm text-gray-500 font-medium">Creators</h4>
          <p className="text-3xl font-bold text-orange-600 mt-1">
            {users.filter(u => u.role === 'creator').length}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h4 className="text-sm text-gray-500 font-medium">Pending Requests</h4>
          <p className="text-3xl font-bold text-yellow-600 mt-1">
            {creators.filter(c => c.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h4 className="text-sm text-gray-500 font-medium">Total Requests</h4>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {creators.length}
          </p>
        </div>
      </div>

      {/* Pending Creator Requests */}
      {creators.filter(c => c.status === 'pending').length > 0 && (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              ⏳ Pending Creator Requests 
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {creators.filter(c => c.status === 'pending').length}
              </span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {creators.filter(c => c.status === 'pending').map((creator) => (
                  <tr key={creator._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {creator.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {creator.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {creator.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {creator.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {new Date(creator.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center space-x-2">
                      <button 
                        onClick={() => handleApproveCreatorRequest(creator)}
                        className="btn btn-sm bg-green-500 text-white hover:bg-green-600"
                      >
                        <FaUserCheck className="w-4 h-4" />
                        <span className="ml-1">Approve</span>
                      </button>
                      <button 
                        onClick={() => handleRejectCreatorRequest(creator)}
                        className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                      >
                        <FaUserTimes className="w-4 h-4" />
                        <span className="ml-1">Reject</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

  
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Manage Users</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user, index) => {
                  const userHasApplied = hasCreatorApplication(user.email);
                  
                  return (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={user.photoURL || 'https://via.placeholder.com/40'} 
                          alt={user.displayName} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.displayName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-green-100 text-green-800' :
                          user.role === 'creator' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {user.role === "admin" ?
                          <button onClick={() => handleRemoveAdmin(user)} className='btn btn-sm bg-red-500 text-white'>
                            <FiShieldOff className='w-4 h-4'/>
                          </button> : 
                          <button onClick={() => handleMakeAdmin(user)} className='btn btn-sm bg-green-500 text-white'>
                            <IoShieldCheckmark className='w-4 h-4'/>
                          </button>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {user.role === "creator" ?
                          <button onClick={() => handleRemoveCreator(user)} className='btn btn-sm bg-red-500 text-white'>
                            <FiShieldOff className='w-4 h-4'/>
                          </button> : 
                          userHasApplied ? (
                            <button onClick={() => handleMakeCreator(user)} className='btn btn-sm bg-orange-500 text-white'>
                              <FaUserCheck className='w-4 h-4'/>
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">No Application</span>
                          )
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-1">
                        <button className="btn btn-sm btn-outline">Edit</button>
                        <button className="btn btn-sm btn-outline">View</button>
                        <button className="btn btn-sm btn-error">
                          <RiDeleteBin6Line className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        👥
                      </div>
                      <h3 className="text-lg font-medium mt-2">No users found</h3>
                      <p className="text-sm">Users will appear here once registered.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
