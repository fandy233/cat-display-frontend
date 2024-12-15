import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, {ensureInterceptorReady} from '../services/apiClient';
import TopCatPic from '../assets/TopCatPic.png';
import '../styles/CatDashboardPage.css';


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
        <>
        <div className="top-image-container">
            <img src={TopCatPic} alt="Cute Cats" className="top-banner-image"/>
        </div>
            <div className="cat-dashboard container">
            {/* Add a picture at the top */}
            <div className="cat-cards row">
                {cats.map((cat) => (
                    <div key={cat.id} className="col-lg-4 col-md-6 mb-4">
                        <div className="card">
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
                                    {/* Divider */}
                                    <div className="card-divider"></div>
                                    <div className="card-actions">
                                        <button
                                            className="show-details-button"
                                            onClick={() => navigate(`/cats/${cat.id}`, { state: { from: window.location.pathname } })}
                                        >
                                            Show Details
                                        </button>
                                        <button
                                            className="edit-button"
                                            onClick={() => navigate(`/edit-cat/${cat.id}`)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                        {/* Empty Card for Adding New Cat */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div
                        className="card empty-card"
                        onClick={() => navigate('/add-cat')}
                    >
                        <div className="card-body d-flex justify-content-center align-items-center">
                            <h3 className="plus-label">+</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default CatDashboardPage;
