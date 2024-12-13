import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import apiClient, {ensureInterceptorReady} from '../services/apiClient';
import { useFormik } from 'formik';
import {catValidationSchema} from "../validation/catValidationSchema.ts";
import 'react-datepicker/dist/react-datepicker.css';
import ReactDatePicker from "react-datepicker";

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

const CatFormPage = ({ isEdit }: { isEdit: boolean }) => {
    const navigate = useNavigate();
    const [cats, setCats] = useState<Cat[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { id } = useParams();
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // limit 5 MB in bytes

    useEffect(() => {
        const fetchCats = async () => {
            try {
                await ensureInterceptorReady(); // Wait for the interceptor to be initialized
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
                    formik.setValues({ ...cat }); // Pre-fill form with existing data
                } catch (err) {
                    console.error('Failed to fetch cat details', err);
                }
            };
            fetchCatDetails();
        }
    }, [isEdit, id]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isUploading) {
                e.preventDefault();
                e.returnValue = 'An image upload is still in progress.';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isUploading]);

    const handleImageUpload = async (file: File) => {

        if (file.size > MAX_FILE_SIZE) {
            alert('File size exceeds 5 MB. Please upload a smaller image.');
            return;
        }

        const formData = new FormData();
        formData.append('smfile', file);
        setIsUploading(true);

        try {
            const response = await apiClient.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            formik.setFieldValue('imageUrl', response.data.url);
            console.log('Image uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsUploading(false); // End upload
        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            breed: '',
            gender: '',
            description: '',
            momId: '',
            dadId: '',
            imageUrl: '',
            dateOfBirth: '',
            certificate: 'None',
            neuteredOrSprayed: false,
            microchip: false,
            forSale: false,
            vaccination: '',
            price: '',
            grade: '',
            color: '',
        },
        validationSchema: catValidationSchema,
        onSubmit: async (values) => {
            try {
                if (isEdit) {
                    console.log('Submitting values:', values)
                    await ensureInterceptorReady(); // Wait for the interceptor to be initialized
                    await apiClient.put(`/users/me/cats/${id}`, values);
                } else {
                    await ensureInterceptorReady(); // Wait for the interceptor to be initialized
                    await apiClient.post('/users/me/cats', values);
                }
                navigate('/dashboard');
            } catch (error) {
                console.error('Failed to save cat details', error);
                setError('Failed to save cat details. Please try again later.');
            }
        },
    });

    return (
        <div className="container">
            <div className="card">
                <h2>{isEdit ? 'Edit Cat' : 'Add New Cat'}</h2>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && <div className="error">{formik.errors.name}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="breed" className="form-label">
                            Breed
                        </label>
                        <input
                            type="text"
                            name="breed"
                            value={formik.values.breed}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.breed && formik.errors.breed &&
                            <div className="error">{formik.errors.breed}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="color" className="form-label">
                            Color
                        </label>
                        <input
                            type="text"
                            name="color"
                            value={formik.values.color}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.color && formik.errors.color &&
                            <div className="error">{formik.errors.color}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender" className="form-label">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formik.values.gender}
                            onChange={formik.handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {formik.touched.gender && formik.errors.gender &&
                            <div className="error">{formik.errors.gender}</div>}
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="neuteredOrSprayed"
                                checked={formik.values.neuteredOrSprayed}
                                onChange={formik.handleChange}
                            />
                            Neutered/Sprayed
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="microchip"
                                checked={formik.values.microchip}
                                onChange={formik.handleChange}
                            />
                            Microchip
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="forSale"
                                checked={formik.values.forSale}
                                onChange={formik.handleChange}
                            />
                            For Sale
                        </label>
                    </div>
                    <div className="form-group">
                        <label>for pet/for breeding</label>
                        <select
                            name="grade"
                            value={formik.values.grade}
                            onChange={formik.handleChange}
                        >
                            <option value="pet">pet</option>
                            <option value="breeding">breeding</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Vaccination Doses</label>
                        <select
                            name="vaccination"
                            value={formik.values.vaccination}
                            onChange={formik.handleChange}
                        >
                            <option value={0}>None</option>
                            <option value={1}>1 dose</option>
                            <option value={2}>2 doses</option>
                            <option value={3}>3 doses</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="text"
                            name="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.price && formik.errors.price && (
                            <div className="error">{formik.errors.price}</div>
                        )}
                    </div>
                    {/* Add the DatePicker Field */}
                    <div className="form-group">
                        <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                        <ReactDatePicker
                            selected={
                                formik.values.dateOfBirth
                                    ? new Date(formik.values.dateOfBirth)
                                    : null
                            }
                            onChange={(date) => {
                                const formattedDate = date
                                    ? date.toISOString().split('T')[0]
                                    : '';
                                formik.setFieldValue('dateOfBirth', formattedDate);
                            }}
                            placeholderText="Select a date"
                            dateFormat="yyyy-MM-dd"
                            isClearable
                            dropdownMode="select"
                            maxDate={new Date()} // Restricts to today and earlier
                        />
                        {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                            <div className="error">{formik.errors.dateOfBirth}</div>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Certificate</label>
                        <select
                            name="certificate"
                            value={formik.values.certificate}
                            onChange={formik.handleChange}
                        >
                            <option value="None">None</option>
                            <option value="CFA">CFA</option>
                            <option value="TICA">TICA</option>
                        </select>
                    </div>
                    <div>
                        <label>Mom:</label>
                        <select
                            name="momId"
                            value={formik.values.momId}
                            onChange={(e) => {
                                const selectedMomId = e.target.value;
                                const selectedMom = cats.find((cat) => cat.id === selectedMomId);

                                formik.setFieldValue('momId', selectedMomId);
                                formik.setFieldValue('momName', selectedMom ? selectedMom.name : '');
                            }}
                        >
                            <option value="">Select Mom</option>
                            {cats.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Dad:</label>
                        <select
                            name="dadId"
                            value={formik.values.dadId}
                            onChange={(e) => {
                                const selectedDadId = e.target.value;
                                const selectedDad = cats.find((cat) => cat.id === selectedDadId);

                                formik.setFieldValue('dadId', selectedDadId);
                                formik.setFieldValue('dadName', selectedDad ? selectedDad.name : '');
                            }}
                        >
                            <option value="">Select Dad</option>
                            {cats.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            rows={3}
                        ></textarea>
                        {formik.touched.description && formik.errors.description && (
                            <div className="error">{formik.errors.description}</div>
                        )}
                    </div>
                    <div className="form-group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    handleImageUpload(e.target.files[0]);
                                }
                            }}
                            disabled={isUploading} // Disable the input while uploading
                        />
                        {isUploading && <p>Uploading image, please wait...</p>}
                        <button disabled={isUploading} type="submit">{isEdit ? 'Update Cat' : 'Add Cat'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CatFormPage;
