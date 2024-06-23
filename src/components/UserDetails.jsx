import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../Services/AuthServices';

const UserDetails = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:7000/api/users/${userId}`, {
                    headers: {
                        "Authorization": "Bearer " + getToken()
                    }
                });
                console.log(response.data)
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [userId]);

    const handleNavigateBack = () => {
        navigate('/users');
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container'>
            <h2 className='header'>User Details</h2>
            <p className='paragraph'><strong>User ID:</strong> {user.userId}</p>
            <p className='paragraph'><strong>Username:</strong> {user.username}</p>
            <p className='paragraph'><strong>Email:</strong> {user.email}</p>
            <h3 className='header'>Sweet Orders</h3>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Order Date</th>
                        <th>Bill Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {user.sweetOrder.map(order => (
                        <tr
                            key={order.sweetOrderId}
                        >
                            <td>{order.sweetOrderId}</td>
                            <td>{order.orderDate}</td>
                            <td>₹{order.totalCost}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className='button' onClick={handleNavigateBack}>Back</button>
        </div>
    );
};

export default UserDetails;
