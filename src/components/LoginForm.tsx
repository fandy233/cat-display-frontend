import { useSetAtom } from 'jotai';
import { login } from '../services/authService';
import { useNavigate } from "react-router-dom";
import { authAtom } from "../state/authAtoms.ts";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../styles/LoginPage.css'

const LoginForm: React.FC = () => {
    const setAuth = useSetAtom(authAtom);
    const navigate = useNavigate();

    const handleLogin = useFormik({
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
                    await login(values, setAuth);
                    alert('Login successful!');
                    // Navigate to user dashboard after successful login
                    navigate('/dashboard');
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    setFieldError('username', `Invalid username or password`);
                    alert('Login failed, please try again.');
                }  finally {
                    setSubmitting(false);
                }
        }
    });

    return (
        <div className="login-container">
            <div className="card">
                <h3>Login</h3>
                <form onSubmit={handleLogin.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className={`form-control ${
                                handleLogin.touched.username && handleLogin.errors.username ? 'is-invalid' : ''
                            }`}
                            id="username"
                            placeholder="Enter your username"
                            {...handleLogin.getFieldProps('username')}
                        />
                        {handleLogin.touched.username && handleLogin.errors.username ? (
                            <div className="invalid-feedback">{handleLogin.errors.username}</div>
                        ) : null}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className={`form-control ${
                                handleLogin.touched.password && handleLogin.errors.password ? 'is-invalid' : ''
                            }`}
                            id="password"
                            placeholder="Enter your password"
                            {...handleLogin.getFieldProps('password')}
                        />
                        {handleLogin.touched.password && handleLogin.errors.password ? (
                            <div className="invalid-feedback">{handleLogin.errors.password}</div>
                        ) : null}
                    </div>
                    <button type="submit" className="btn w-100 mb-3"
                            style={{ backgroundColor: '#8B5E3C', color: '#FFF9F3', border: 'none' }}
                            disabled={handleLogin.isSubmitting}>
                        Login</button>
                    <button type="button" className="btn btn-link w-100" onClick={() => navigate('/register')}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;