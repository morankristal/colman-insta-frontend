import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HomePage from "./pages/HomePage.tsx";
import UserProfilePage from "./pages/UserProfilePage.tsx";

// יצירת QueryClient
const queryClient = new QueryClient();

function App() {
    return (
        // עטיפה ב-QueryClientProvider
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/homePage" element={<HomePage />} />
                    <Route path="/user/:username" element={<UserProfilePage />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
