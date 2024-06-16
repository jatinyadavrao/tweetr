import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Center from './components/Center';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import SignUp from './components/SignUp';
import Login from './components/Login';
import axios from 'axios';
import { backendUrl } from './variable';
import { UserContext } from './components/UserContext';
import Profile from './components/Profile';
import Messages from './components/Messages'
import Notifications from './components/Notifications';
function App() {
  const [topUp, setTopUp] = useState(false);
  const [content, setContent] = useState('');
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check user authentication status when app loads
    const checkAuthentication = async () => {
      try {
        // Send a request to your backend to check if the user is authenticated
        const response = await axios.get(`${backendUrl}/api/auth/check`, {
          withCredentials: true,
        });
        // If the user is authenticated, set the user context
        setUser(response.data.user);
      } catch (error) {
        // If there's an error or the user is not authenticated, setUser to null
        setUser(null);
      }
    };

    // Call the checkAuthentication function when the app first loads
    checkAuthentication();
  }, [setUser]);

  const onTheTopUp = () => {
    setTopUp(true);
  };

  const closeTopUp = () => {
    setTopUp(false);
    setContent('');
  };

  const postTweet = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/post`, {
        content,
      }, { withCredentials: true });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    closeTopUp();
  };

  return (
    <div className='flex flex-col min-h-screen'>
      {!user ? (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
          <div className='bg-white p-6 shadow-lg rounded'>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
            <div className='text-center mt-4'>
              <p>Don't have an account?</p>
              <button
                className='bg-blue-800 text-white font-bold text-lg px-4 py-2 mt-2 rounded'
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex gap-4 w-full p-4 bg-gray-100'>
          {/* Left Sidebar */}
          <div className='w-1/5'>
            <div className='bg-white p-4 shadow rounded'>
              <LeftSidebar />
            </div>
            <button
              className='bg-blue-800 text-white font-bold text-xl px-4 py-2 mt-4 rounded w-full'
              onClick={onTheTopUp}
            >
              Post
            </button>
            <div className='mt-4 flex justify-between gap-2 items-start'>
              <div className='text-lg font-semibold'>{user && user.name}</div>
              <button className='bg-gray-300 text-black font-bold px-3 py-1 rounded'>My Profile</button>
            </div>
          </div>

          {/* Center */}
          <div className='flex-1 relative'>
            {/* TopUp */}
            {topUp && (
              <div className='flex flex-col gap-2 z-40 shadow-lg p-4 absolute top-0 left-0 right-0 bg-white backdrop-blur-sm w-full rounded'>
                <textarea
                  cols="30"
                  rows="10"
                  placeholder='Enter Your Content Here'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className='text-black p-2 outline-none border border-gray-300 rounded-sm w-full'
                ></textarea>
                <div className='flex gap-2 mt-2'>
                  <button
                    className='bg-red-800 text-white text-lg px-4 py-2 rounded font-bold'
                    onClick={closeTopUp}
                  >
                    Cancel
                  </button>
                  <button
                    className='bg-green-800 text-white text-lg px-4 py-2 font-bold rounded'
                    onClick={postTweet}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}

            {/* Center Content */}
            <Routes>
              <Route path="/" element={<Center />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/profile/:profileUserId" element={<Profile/>} />
              <Route path = "/messages/*" element={<Messages/>}/>
              <Route path = "/notifications" element={<Notifications/>}/>
            </Routes>
          </div>

          {/* Right Sidebar */}
          <div className='w-1/4'>
            <RightSidebar />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
