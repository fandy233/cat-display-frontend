import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../atoms/authAtoms';
import apiClient from '../services/apiClient';

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
    const token = useAtomValue(tokenAtom);
    const navigate = useNavigate();
    const [cats, setCats] = useState<Cat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            const fetchCats = async () => {
                try {
                    setLoading(true);
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
        }
    }, [token, navigate]);

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
                            <div className="card-body" key={cat.id} onClick={() => navigate(`/cats/${cat.id}`)}>
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
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CatDashboardPage;
