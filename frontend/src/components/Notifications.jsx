import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { backendUrl } from '../variable';
import toast, { Toaster } from 'react-hot-toast';

const Notifications = () => {
    const { user, setUser } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/notification/receive`, { withCredentials: true });
            setNotifications(response.data.data);
        } catch (error) {
            console.error("Error fetching notifications", error);
            toast.error("Failed to fetch notifications");
        }
    };

    const handleAccept = async (notificationId) => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/notification/accept/${notificationId}`,  { withCredentials: true });
            setNotifications(notifications.filter(notification => notification._id !== notificationId));
            console.log(response.data)
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error accepting notification", error);
            toast.error("Failed to accept notification");
        }
    };

    const handleReject = async (notificationId) => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/notification/reject/${notificationId}`,{ withCredentials: true });
            console.log(response.data)
            setNotifications(notifications.filter(notification => notification._id !== notificationId));
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error rejecting notification", error);
            toast.error("Failed to reject notification");
        }
    };

    if (notifications.length === 0) {
        return <div className="flex justify-center items-center h-screen text-gray-500">No notifications</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden">
            <Toaster />
            <div className="p-6 bg-blue-500 text-white text-center">
                <h2 className="text-3xl font-bold">Notifications</h2>
            </div>
            <div className="p-6">
                {notifications.map(notification => (
                    <div key={notification._id} className="p-4 border-b border-gray-200">
                        <p>{notification.message}</p>
                        <div className="mt-4">
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors duration-300"
                                onClick={() => handleAccept(notification._id)}
                            >
                                Accept
                            </button>
                            <button
                                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors duration-300"
                                onClick={() => handleReject(notification._id)}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
