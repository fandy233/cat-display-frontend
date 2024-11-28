import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import apiClient from '../services/apiClient';

interface Cat {
    id: string;
    name: string;
    photoUrl: string;
    breed: string;
    gender: string;
    description: string;
    momId: string;
    dadId: string;
    momName: string;
    dadName: string;
}

const CatFormPage = ({ isEdit }: { isEdit: boolean }) => {
    const navigate = useNavigate();
    const [name, setName] = useState<string>('');
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [breed, setBreed] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [cats, setCats] = useState<Cat[]>([]);
    const [momId, setMomId] = useState('');
    const [dadId, setDadId] = useState('');
    const [momName, setMomName] = useState('');
    const [dadName, setDadName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const response = await apiClient.get('/users/me/cats');
                setCats(response.data);
            } catch (err) {
                console.error('Failed to fetch cats', err);
                setError('Failed to load cat data. Please try again later.');
            }
        };
        fetchCats();
    }, []);

    useEffect(() => {
        if (isEdit && id) {
            const fetchCatDetails = async () => {
                try {
                    const response = await apiClient.get(`/cats/${id}`);
                    const cat = response.data;
                    setName(cat.name);
                    setBreed(cat.breed);
                    setGender(cat.gender);
                    setDescription(cat.description);
                    setPhotoUrl(cat.photoUrl);
                    setMomId(cat.momId || '');
                    setDadId(cat.dadId || '');
                    setMomName(cat.momName || '');
                    setDadName(cat.dadName || '');
                } catch (err) {
                    console.error('Failed to fetch cat details', err);
                }
            };
            fetchCatDetails();
        }
    }, [isEdit, id]);

    const handleAddCat = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const newCat = {
                name,
                breed,
                gender,
                description,
                photoUrl,
                ...(momId && { momId, momName: cats.find(cat => cat.id === momId)?.name || '' }),
                ...(dadId && { dadId, dadName: cats.find(cat => cat.id === dadId)?.name || '' }),
                momName,
                dadName
            };
            if (isEdit) {
                await apiClient.put(`/users/me/cats/${id}`, newCat);
            } else {
                await apiClient.post('/users/me/cats', newCat);
            }
            navigate('/dashboard');

        } catch (error) {
            console.error('Failed to add cat', error);
            setError('Failed to add cat. Please try again later.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{maxWidth: '500px', width: '100%'}}>
                <h2>{isEdit ? 'Edit Cat' : 'Add New Cat'}</h2>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <form onSubmit={handleAddCat}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="photoUrl" className="form-label">
                            Photo URL
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="photoUrl"
                            value={photoUrl}
                            onChange={(e) => setPhotoUrl(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="breed" className="form-label">
                            Breed
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="breed"
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">
                            Gender
                        </label>
                        <select
                            className="form-control"
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            className="form-control"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        ></textarea>
                    </div>
                    <div>
                        <label>Mom:</label>
                        <select value={momId} onChange={(e) => {
                            setMomId(e.target.value);
                            setMomName(cats.find(cat => cat.id === e.target.value)?.name || '');
                        }}>
                            <option value="">Select Mom</option>
                            {cats.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Dad:</label>
                        <select value={dadId} onChange={(e) => {
                            setDadId(e.target.value);
                            setDadName(cats.find(cat => cat.id === e.target.value)?.name || '');
                        }}>
                            <option value="">Select Dad</option>
                            {cats.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">{isEdit ? 'Update Cat' : 'Add Cat'}</button>
                </form>
            </div>
        </div>
    );
};

export default CatFormPage;
