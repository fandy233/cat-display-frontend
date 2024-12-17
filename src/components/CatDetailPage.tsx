import {useLocation, useNavigate, useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import dayjs from "dayjs";
import '../styles/CatDetailPage.css';

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
    neuteredOrSprayed: boolean;
    vaccination: number;
    dateOfBirth: string;
    microchip: boolean;
    certificate: string;
    price: number;
    forSale: boolean;
    age: string; // Calculated field
    grade: string;
    color: string;
}

const CatDetailPage = () => {
    const { id } = useParams();
    const [cat, setCat] = useState<Cat>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleGenerateInfoCard = () => {
        // Navigate to the info card generation page
        navigate(`/cat/${id}/info-card`);
    };

    useEffect(() => {
        const fetchCatDetails = async () => {
            try {
                const response = await apiClient.get(`/cats/${id}`);
                setCat(response.data);
            } catch (error) {
                console.error('Failed to fetch CatDetails', error);
                setError('Failed to load cat details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchCatDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!cat) {
        return <div>Cat details not found.</div>;
    }

    return (
        <div className="cat-detail" style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px'
        }}>
            {/* Back Button */}
            <button
                className="back-button"
                onClick={() => navigate(location.state?.from || '/dashboard')}
            >
                Back
            </button>
            <button onClick={handleGenerateInfoCard}>Generate Info Card</button>
            <div className="cat-header" style={{textAlign: 'center'}}>
                <h2 style={{color: '#333'}}>{cat.name}</h2>
                {cat.imageUrl && (
                    <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        style={{
                            width: '300px',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '15px',
                            margin: '20px 0'
                        }}
                    />
                )}
            </div>
            {/* Divider Below the Image */}
            <div className="divider horizontal-divider"></div>
            <div className="cat-details-grid">
                {/* Left side columns */}
                <div className="left-columns">
                    {cat.gender && (
                        <>
                            <div className="field-name">Gender:</div>
                            <div className="field-value">{cat.gender}</div>
                        </>
                    )}
                    {cat.breed && (
                        <>
                            <div className="field-name">Breed:</div>
                            <div className="field-value">{cat.breed}</div>
                        </>
                    )}
                    {cat.color && (
                        <>
                            <div className="field-name">Color:</div>
                            <div className="field-value">{cat.color}</div>
                        </>
                    )}
                    {cat.dateOfBirth && (
                        <>
                            <div className="field-name">Birthday:</div>
                            <div className="field-value">
                                {dayjs(cat.dateOfBirth).format('MMMM D, YYYY')}
                            </div>
                        </>
                    )}
                    {cat.age && (
                        <>
                            <div className="field-name">Age:</div>
                            <div className="field-value">{cat.age}</div>
                        </>
                    )}
                    <div className="field-name">Neutered/Sprayed:</div>
                    <div className="field-value">
                        {cat.neuteredOrSprayed ? (
                            <span className="comic-checkmark">✔</span>
                        ) : (
                            <span className="comic-cross">✘</span>
                        )}
                    </div>

                    {cat.vaccination && (
                        <>
                            <div className="field-name">Vaccination doses:</div>
                            <div className="field-value">{cat.vaccination}</div>
                        </>
                    )}
                </div>
                {/* Divider */}
                <div className="divider"></div>
                {/* Right side columns */}
                <div className="right-columns">
                    <div className="field-name">For Sale:</div>
                    <div className="field-value">
                        {cat.forSale ? (
                            <span className="comic-checkmark">✔</span>
                        ) : (
                            <span className="comic-cross">✘</span>
                        )}
                    </div>

                    {cat.certificate && (
                        <>
                            <div className="field-name">Pedigree:</div>
                            <div className="field-value">{cat.certificate}</div>
                        </>
                    )}
                    <div className="field-name">Microchip:</div>
                    <div className="field-value">
                        {cat.microchip ? (
                            <span className="comic-checkmark">✔</span>
                        ) : (
                            <span className="comic-cross">✘</span>
                        )}
                    </div>
                    {cat.grade && (
                        <>
                            <div className="field-name">Grade:</div>
                            <div className="field-value">{cat.grade}</div>
                        </>
                    )}
                    {cat.momId && (
                        <>
                            <div className="field-name">Mom:</div>
                            <div className="field-value">
                        <span
                            className="link"
                            style={{color: 'blue', cursor: 'pointer'}}
                            onClick={() =>
                                navigate(`/cats/${cat.momId}`, {state: {from: window.location.pathname}})}
                        >
                            {cat.momName}
                        </span>
                            </div>
                        </>
                    )}
                    {cat.dadId && (
                        <>
                            <div className="field-name">Dad:</div>
                            <div className="field-value">
                        <span
                            className="link"
                            style={{color: 'blue', cursor: 'pointer'}}
                            onClick={() =>
                                navigate(`/cats/${cat.dadId}`, {state: {from: window.location.pathname}})}
                        >
                            {cat.dadName}
                        </span>
                            </div>
                        </>
                    )}
                    {cat.price && (
                        <>
                            <div className="field-name">Price:</div>
                            <div className="field-value">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(Number(cat.price))} {/* Ensure cat.price is a number */}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="divider horizontal-divider"></div>
            {cat.description && (
                <div className="description-container">
                    <div className="description-background">
                        <strong className="description-label">Description:</strong>
                        <div className="description-value">
                            <p>{cat.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CatDetailPage;