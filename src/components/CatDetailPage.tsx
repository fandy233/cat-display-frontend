import {useNavigate, useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
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

const CatDetailPage = () => {
    const { id } = useParams();
    const [cat, setCat] = useState<Cat>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px'
        }}>
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
            {cat.breed && <p style={{fontSize: '1.2em'}}><strong>Breed:</strong> {cat.breed}</p>}
            {cat.gender && <p style={{fontSize: '1.2em'}}><strong>Gender:</strong> {cat.gender}</p>}
            {cat.momId && (
                <p style={{ fontSize: '1.2em' }}>
                    <strong>Mom:</strong> <span className="link" style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate(`/cats/${cat.momId}`)}>{cat.momName}</span>
                </p>
            )}
            {cat.dadId && (
                <p style={{ fontSize: '1.2em' }}>
                    <strong>Dad:</strong> <span className="link" style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate(`/cats/${cat.dadId}`)}>{cat.dadName}</span>
                </p>
            )}
            {cat.description &&
                <p style={{fontSize: '1.2em', color: '#666'}}><strong>Description:</strong> {cat.description}</p>}
        </div>
    );
};

export default CatDetailPage;