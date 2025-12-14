import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoShieldCheckmark } from "react-icons/io5";
import { FiShieldOff } from "react-icons/fi";
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const axiosSecure= useAxiosSecure()
    const {refetch, data: users = [] } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const res = await axiosSecure.get('/users')
    return res.data
  }
})



const handleMakeUser = user => {
    const roleInfo = {role: 'admin'}
    axiosSecure.patch(`/users/${user._id}`,roleInfo)
    .then(res => {
        if(res.data.modifiedCount){
            refetch()
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `${user.displayName} Marked as Admin`
            })
        }
    })
}



// const handleRemoveAdmin = user => {
//     const roleInfo = {role: 'user'}
//     axiosSecure.patch(`/users/${user._id}`, roleInfo)
//     .then(res => {
//         if(res.data.modifiedCount){
//             refetch()
//             Swal.fire({
//                 position: 'top-end',
//                 icon: 'success',
//                 title: `${user.displayName} removed from Admin`
//             })

//         }
//     })
// }


const handleRemoveAdmin = (user) => {
  Swal.fire({
    title: `Are you sure?`,
    text: `Do you want to remove ${user.displayName} from Admin?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, remove!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      const roleInfo = { role: 'user' };
      axiosSecure.patch(`/users/${user._id}`, roleInfo)
        .then(res => {
          if (res.data.modifiedCount) {
            refetch(); // refresh the user list
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `${user.displayName} removed from Admin`,
              showConfirmButton: false,
              timer: 1500
            });
          }
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
          console.log(err);
        });
    }
  });
};



    return (
        <div>
        
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      

        <div className="bg-white ml-10 shadow rounded-lg p-5">
          <h4 className="text-sm text-gray-500">Total users</h4>
          <p className="text-2xl font-bold text-blue-500">
            {users.length}
          </p>
        </div>
        <div className="bg-white ml-10 shadow rounded-lg p-5">
          <h4 className="text-sm text-gray-500">Total users</h4>
          <p className="text-2xl font-bold text-blue-500">
            {users.length}
          </p>
        </div>
      </div>

     
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-5 border-b">
          Manage users
        </h2>

        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3">No</th>
              <th className="px-6 py-3">Photo</th>
              <th className="px-6 py-3 text-center">User Email</th>
              <th className="px-6 py-3 text-center">Role</th>
              <th className="px-6 py-3 text-center">Created At</th>
              <th className="px-6 py-3 text-center">Admin Action</th>
              <th className="px-6 py-3 text-center">Action</th>
              
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">
                    <img src={user.photoURL} alt="" className='w-10 rounded-3xl h-10' />
                  </td>
                  <td className="px-6 py-4 text-center">{user.email}</td>
                  <td className="px-6 py-4 text-center">{user.role}</td>
                  <td className="px-6 py-4 text-center">{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">

                    {user.role === "admin" ? <button onClick={() => handleRemoveAdmin(user)} className='btn bg-green-400'>
                        <IoShieldCheckmark />
                    </button> : <button className='btn bg-red-400' onClick={() => handleMakeUser(user)}>
                        <FiShieldOff />
                        </button>}

                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className='btn'>

                    </button>
                    <button className='btn'>
                    </button>
                    <button className='btn'>
                    <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No Users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>










        </div>
    );
};

export default ManageUsers;