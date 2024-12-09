import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, {ensureInterceptorReady} from '../services/apiClient';

interface Cat {
    id: string;
    name: string;
    imageUrl: string;
    breed: string;
    gender: string;
    description: string;
    momId: string;
    dadId: string;
    momName: string;
    dadName: string;
}

const CatDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [cats, setCats] = useState<Cat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
            const fetchCats = async () => {
                try {
                    setLoading(true);
                    await ensureInterceptorReady(); // Wait for the interceptor to be initialized
                    const response = await apiClient.get('/users/me/cats');
                    console.log(response.data);
                    setCats(response.data);
                } catch (error) {
                    console.error('Failed to fetch cats', error);
                    setError('Failed to load cat data. Please try again later.');
                } finally {
                    setLoading(false);
                }
            };

            fetchCats();

    }, [navigate]);

    if (loading) {
        return (
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Cat Dashboard</h2>
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/add-cat')}
                >
                    Add New Cat
                </button>
            </div>
            <div className="row">
                {cats.map((cat) => (
                    <div key={cat.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img
                                src={cat.imageUrl}
                                className="card-img-top"
                                alt={cat.name}
                            />
                            <div className="card-body" key={cat.id}>
                                <h5 className="card-title">{cat.name}</h5>
                                <p className="card-text">
                                    <strong>Breed:</strong> {cat.breed}
                                </p>
                                <p className="card-text">
                                    <strong>Gender:</strong> {cat.gender}
                                </p>
                                <p className="card-text">
                                    <strong>Description:</strong> {cat.description}
                                </p>
                                <button
                                    onClick={() => navigate(`/cats/${cat.id}`)}
                                    style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        left: '10px',
                                        padding: '5px 10px',
                                        backgroundColor: '#17a2b8',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Show Details
                                </button>
                                <button
                                    onClick={() => navigate(`/edit-cat/${cat.id}`)}
                                    style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        right: '10px',
                                        padding: '5px 10px',
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CatDashboardPage;
