import {useAxiosInterceptor} from "./services/apiClient.ts";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LoginForm from "./components/LoginForm.tsx";
import RegistrationForm from "./components/RegistrationForm.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import CatDashboardPage from "./components/CatDashboardPage.tsx";
import CatFormPage from "./components/CatFormPage.tsx";
import CatDetailPage from "./components/CatDetailPage.tsx";

export const AppWithInterceptor = () => {
    useAxiosInterceptor();

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm/>}/>
                <Route path="/register" element={<RegistrationForm/>}/>
                <Route path="/dashboard" element={<PrivateRoute><CatDashboardPage/></PrivateRoute>}/>
                <Route path="/add-cat" element={<PrivateRoute><CatFormPage isEdit={false}/></PrivateRoute>}/>
                <Route path="/edit-cat/:id" element={<PrivateRoute><CatFormPage isEdit={true}/></PrivateRoute>}/>
                <Route path="/cats/:id" element={<CatDetailPage/>}/>
                <Route path="/" element={<LoginForm/>}/>
            </Routes>
        </Router>
    );

};