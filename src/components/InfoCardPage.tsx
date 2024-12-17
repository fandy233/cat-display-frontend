import {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { toPng } from 'html-to-image';
import '../styles/InfoCardPage.css';
import apiClient from "../services/apiClient.ts"; // Import the custom CSS

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

const InfoCardPage = () => {
    const { id } = useParams();
    const [cat, setCat] = useState<Cat>();
    const cardRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const handleDownload = () => {
        if (cardRef.current) {
            toPng(cardRef.current)
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = `cat-info-card.png`;
                    link.href = dataUrl;
                    link.click();
                })
                .catch((error) => console.error('Error generating image:', error));
        } else {
            console.error('Card reference is null');
        }
    };

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
        <div className="info-card-page">
            <button className="back-button" onClick={() => navigate(-1)}>
                Back
            </button>
            <div ref={cardRef} className="info-card">
                <div className="card-header">
                    <h2>{cat.name}</h2>
                    {cat.imageUrl && (
                        <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="cat-image"
                        />
                    )}
                </div>
                <div className="card-details">
                    <div className="details-column">
                        {cat.gender && <p><strong>Gender:</strong> {cat.gender}</p>}
                        {cat.breed && <p><strong>Breed:</strong> {cat.breed}</p>}
                        {cat.color && <p><strong>Color:</strong> {cat.color}</p>}
                        {cat.dateOfBirth && <p><strong>Birthday:</strong> {cat.dateOfBirth}</p>}
                        {cat.age && <p><strong>Age:</strong> {cat.age}</p>}
                        <p>
                            <strong>Neutered/Sprayed:</strong>{' '}
                            {cat.neuteredOrSprayed ? '✔' : '✘'}
                        </p>
                    </div>
                    <div className="details-column">
                        <p>
                            <strong>For Sale:</strong> {cat.forSale ? '✔' : '✘'}
                        </p>
                        {cat.certificate && (
                            <p><strong>Certificate:</strong> {cat.certificate}</p>
                        )}
                        <p>
                            <strong>Microchip:</strong> {cat.microchip ? '✔' : '✘'}
                        </p>
                        {cat.price && (
                            <p>
                                <strong>Price:</strong>{' '}
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(Number(cat.price))}
                            </p>
                        )}
                    </div>
                </div>
                {cat.description && (
                    <div className="description-section">
                        <strong>Description:</strong>
                        <p>{cat.description}</p>
                    </div>
                )}
            </div>
            <button className="download-button" onClick={handleDownload}>
                Download Info Card
            </button>
        </div>
    );
};

export default InfoCardPage;
