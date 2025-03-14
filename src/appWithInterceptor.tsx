import {useAxiosInterceptor} from "./services/apiClient.ts";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LoginForm from "./components/LoginForm.tsx";
import RegistrationForm from "./components/RegistrationForm.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import CatDashboardPage from "./components/CatDashboardPage.tsx";
import CatFormPage from "./components/CatFormPage.tsx";
import CatDetailPage from "./components/CatDetailPage.tsx";
import NavBar from "./components/NavBar.tsx";
import InfoCardPage from "./components/InfoCardPage.tsx";

export const AppWithInterceptor = () => {
    useAxiosInterceptor();

    return (
        <Router>
            <NavBar />
            <div style={{ marginTop: '60px' }}> {/* Add margin to prevent content from being hidden behind the navbar */}
            <Routes>
                <Route path="/login" element={<LoginForm/>}/>
                <Route path="/register" element={<RegistrationForm/>}/>
                <Route path="/dashboard" element={<PrivateRoute><CatDashboardPage/></PrivateRoute>}/>
                <Route path="/add-cat" element={<PrivateRoute><CatFormPage isEdit={false}/></PrivateRoute>}/>
                <Route path="/edit-cat/:id" element={<PrivateRoute><CatFormPage isEdit={true}/></PrivateRoute>}/>
                <Route path="/cats/:id" element={<CatDetailPage/>}/>
                <Route path="/cat/:id/info-card" element={<InfoCardPage />} />
                <Route path="/" element={<LoginForm/>}/>
            </Routes>
            </div>
        </Router>
    );

};