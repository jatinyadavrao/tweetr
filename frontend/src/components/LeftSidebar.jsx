import React from 'react';
import { Link } from 'react-router-dom';

const LeftSidebar = () => {
    
    
    return (
        <div className="bg-gray-200 w-64 overflow-y-auto">
            <div className="p-4">
                <h1 className="text-xl font-bold">Tweetr</h1>
                <ul className="mt-4">
                    <li>
                        <Link to="/" className="block py-2 px-4 text-gray-800 hover:bg-gray-300 rounded">Home</Link>
                    </li>
                    <li>
                        <Link to="/notifications" className="block py-2 px-4 text-gray-800 hover:bg-gray-300 rounded">Notifications</Link>
                    </li>
                    <li>
                        <Link to="/messages" className="block py-2 px-4 text-gray-800 hover:bg-gray-300 rounded">Messages</Link>
                    </li>
                    <li>
                    <Link to="/following" className="block py-2 px-4 text-gray-800 hover:bg-gray-300 rounded">Following</Link>
                    </li>
                  
                </ul>
            </div>
        </div>
    );
};

export default LeftSidebar;
