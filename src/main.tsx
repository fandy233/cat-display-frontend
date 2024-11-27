import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import './index.css';
import CatDashboardPage from "./components/CatDashboardPage.tsx";
import AddingCatPage from "./components/AddingCatPage.tsx";
import CatDetailPage from "./components/CatDetailPage.tsx";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/dashboard" element={<CatDashboardPage />} />
                <Route path="/add-cat" element={<AddingCatPage />} />
                <Route path="/cats/:id" element={<CatDetailPage />} />
                <Route path="/" element={<LoginForm />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
