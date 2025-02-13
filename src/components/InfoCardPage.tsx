import {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/InfoCardPage.css';
import apiClient from "../services/apiClient.ts";
import pawsImage from '../assets/paws01.png';
import borderImage from '../assets/border_image_1.jpg';
import domtoimage from 'dom-to-image-more';

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
            domtoimage.toPng(cardRef.current, {
                width: cardRef.current.offsetWidth + 20, // Use the rendered width
                height: cardRef.current.offsetHeight + 20, // Use the rendered height
                style: {
                    backgroundColor: 'white', // Ensure background is white
                    margin: '0px', // Adjust capture starting position
                    padding: '10px', // Adds buffer space
                    transform: 'scale(1)', // Shift capture area
                    transformOrigin: 'top left', // Proper scaling origin
                },
            })
                .then((dataUrl:string) => {
                    const link = document.createElement('a');
                    link.download = 'cat-info-card.png';
                    link.href = dataUrl;
                    link.click();
                })
                .catch((error:Error) => {
                    console.error('Error generating image:', error);
                });
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
            <div ref={cardRef} className="info-card-wrapper">
                <img src={borderImage} className="border-image" alt="Border"/>
                <div className="info-card">
                    <div className="card-content">
                        {/* Left Section: Photo */}
                        <div className="photo-section">
                            {cat.imageUrl && (
                                <img
                                    src={cat.imageUrl}
                                    alt={cat.name}
                                    className="cat-image"
                                />
                            )}
                        </div>

                        {/* Right Section: Info */}
                        <div className="info-section">
                            <div className="info-tittle">Info Card</div>
                            {/* Divider Below the Title */}
                            <div className="divider horizontal-divider"></div>
                            <div className="info-columns">
                                <div className="info-column">
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
                                <div className="info-column">
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
                        </div>
                    </div>

                    {/* Description Section */}
                    {cat.description && (
                        <div className="description-section">
                            <strong>Description:</strong>
                            <p>{cat.description}</p>
                        </div>
                    )}
                </div>
                <img src={pawsImage} className="paw-image" alt="Decorative Paws"/>
            </div>
            <div className="button-container">
                <button className="info-back-button" onClick={() => navigate(-1)}>
                        Back
                    </button>
                    <button className="download-button" onClick={handleDownload}>
                        Generate Info Card
                    </button>
                </div>
            </div>
            );
            };

            export default InfoCardPage;
