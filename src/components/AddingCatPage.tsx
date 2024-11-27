import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const AddingCatPage: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState<string>('');
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [breed, setBreed] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleAddCat = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await apiClient.post(
                '/users/me/cats',
                { name, photoUrl, breed, gender, description },
            );

            if (response.status === 201) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Failed to add cat', error);
            setError('Failed to add cat. Please try again later.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
                <h3 className="text-center mb-4">Add New Cat</h3>
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
                            required
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
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Add Cat
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddingCatPage;
