import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./pages/HomePage.tsx";
import UserProfilePage from "./pages/UserProfilePage.tsx";
import EditProfile from "./components/users/EditProfile.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import CreatePost from "./components/posts/CreatePost.tsx";
import EditPost from "./components/posts/EditPost.tsx";
import DeletePostButton from "./components/posts/DeletePostButton.tsx";
import AskPage from "./pages/AskPage.tsx";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/homePage" element={<HomePage />} />
                        <Route path="/profile/:username" element={<UserProfilePage />} />
                        <Route path="/edit-profile/:id" element={<EditProfile />} />
                        <Route path="/create-post" element={<CreatePost/>} />
                        <Route path="/edit-post/:id" element={<EditPost/>} />
                        <Route path="/delte-post/:postId" element={<DeletePostButton/>} />
                        <Route path="/ai-create-post" element={<AskPage/>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
