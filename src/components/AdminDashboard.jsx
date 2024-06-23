import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../Services/AuthServices";

const AdminDashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:7000/api/users", {
                    headers: {
                        "Authorization": "Bearer " + getToken()
                    }
                });
                setUserCount(response.data.length);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchSweetOrders = async () => {
            try {
                const response = await axios.get("http://localhost:7000/api/sweetorders", {
                    headers: {
                        "Authorization": "Bearer " + getToken()
                    }
                });
                setOrderCount(response.data.length);

                let total = 0;
                response.data.forEach(order => {
                    total += order.totalCost;
                });
                setTotalRevenue(total);
            } catch (error) {
                console.error('Error fetching sweet orders:', error);
            }
        };

        fetchUserData();
        fetchSweetOrders();
    }, []);

    const handleNavigateToSweetOrders = () => {
        navigate('/sweetorders');
    }

    const handleNavigateToUserList = () => {
        navigate('/users');
    }

    const handleNavigateToProductList = () => {
        navigate('/products');
    }

    const styles = {
        dashboardContainer: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        },
        dashboardGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginTop: '20px'
        },
        gridBox: {
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
        buttonContainer: {
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-around'
        },
        button: {
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#007BFF',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
        }
    };

    return (
        <div style={styles.dashboardContainer}>
            <h1>Admin Dashboard</h1>
            <div style={styles.dashboardGrid}>
                <div style={styles.gridBox}>
                    <h2>Number of Users</h2>
                    <p>👨‍💻{userCount}</p>
                </div>
                <div style={styles.gridBox}>
                    <h2>Number of Sweet Orders Placed</h2>
                    <p>🧾{orderCount}</p>
                </div>
                <div style={styles.gridBox}>
                    <h2>Total Revenue Generated</h2>
                    <p>💰{totalRevenue}</p>
                </div>
            </div>
            <div style={styles.buttonContainer}>
                <button className="button" onClick={handleNavigateToSweetOrders}>Sweet Orders</button>
                <button className="button" onClick={handleNavigateToUserList}>Users List</button>
                <button className="button" onClick={handleNavigateToProductList}>Product List</button>
            </div>
        </div>
    );
}

export default AdminDashboard;
