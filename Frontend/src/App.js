import { Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';

// import component yang berhubungan dengan user
import { UserProtectedRoute } from './pages/user';
// import DashboardUser from "./pages/user/dashboard-user";
import UserCheckDocument from './pages/user/check-document';
import NotFound from './pages/not-found';
import FeedbackForm from './pages/user/feedback';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}

        <Route
          path="/check-document"
          element={
            <UserProtectedRoute>
              <UserCheckDocument />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <UserProtectedRoute>
              <FeedbackForm />
            </UserProtectedRoute>
          }
        />
        {/* Tambah Route lainnya di sini */}
        {/* End of User Routes */}

        {/* Admin Routes */}

        {/* Tambah Route admin jangan lupa buat AdminProtectedRoute 
        dan bungkus component adminya seperti di route user di atas */}

        {/* End of Admin Routes */}

        {/* Tambah route not found apabila user mengakses URL yang tidak terdaftar di App.js */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
