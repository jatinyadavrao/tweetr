import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../variable'
import { useNavigate } from 'react-router-dom'

const RightSidebar = () => {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/users`, { withCredentials: true })
      console.log(response.data)
      setUsers(response.data.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }
 const userProfile = (id)=>{
        navigate(`/profile/${id}`)
 }
  useEffect(() => {
    fetchAllUsers()
  }, [])

  return (
    <div className='flex flex-col gap-3 bg-gray-400 p-3'>
      <div className='font-bold'>Suggestions</div>
      {users.map((user) => (
        <div key={user._id} className='flex flex-col gap-2 p-2 bg-white rounded'>
          <div className='flex justify-between items-center'>
            <div className='text-lg font-semibold'>{user.name}</div>
            <button className='bg-blue-700 text-white font-bold p-2 rounded' onClick={()=>{userProfile(user._id)}}>Visit Profile</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RightSidebar
