import {register} from '../services/authService';
import { useNavigate } from 'react-router-dom';
import {useFormik} from "formik";
import * as Yup from "yup";

const RegistrationForm: React.FC = () => {
    const navigate = useNavigate();

    const handleRegister = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, 'Username must be at least 3 characters')
                .max(20, 'Username must not exceed 20 characters')
                .required('Username is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
        }),
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                await register(values);
                alert('registration successfully!');
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setFieldError('username', `Invalid username or password`);
                alert('Registration failed, please try again.');
            }  finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{maxWidth: '400px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)',}}>
                <h3 className="text-center mb-4">Register</h3>
                <form onSubmit={handleRegister.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className={`form-control ${
                                handleRegister.touched.username && handleRegister.errors.username ? 'is-invalid' : ''
                            }`}
                            id="username"
                            placeholder="Enter your username"
                            {...handleRegister.getFieldProps('username')}
                        />
                        {handleRegister.touched.username && handleRegister.errors.username ? (
                            <div className="invalid-feedback">{handleRegister.errors.username}</div>
                        ) : null}
                    </div>
                    <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className={`form-control ${
                                handleRegister.touched.password && handleRegister.errors.password ? 'is-invalid' : ''
                            }`}
                            id="password"
                            placeholder="Enter your password"
                            {...handleRegister.getFieldProps('password')}
                        />
                        {handleRegister.touched.password && handleRegister.errors.password ? (
                            <div className="invalid-feedback">{handleRegister.errors.password}</div>
                        ) : null}
                    </div>
                    <button type="submit" className="btn w-100 mb-3"
                            style={{ backgroundColor: '#8B5E3C', color: '#FFF9F3', border: 'none' }}
                            disabled={handleRegister.isSubmitting}>
                        Register</button>
                    <button type="button" className="btn btn-link w-100 text-center" onClick={() => navigate('/login')}>
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;