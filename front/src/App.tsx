import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import { getAccessToken } from "./auth/authStorage";
import Content from "./content/Content";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import PaymentSuccess from "./pages/PaymentSuccess";

const ProtectedRoute = () => {
  const isAuthenticated = Boolean(getAccessToken());

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Content />;
};

const App = () => {
  const isAuthenticated = Boolean(getAccessToken());

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/content" : "/register"} replace />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/content" replace /> : <Register />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/content" replace /> : <Login />}
      />
      <Route path="/content" element={<ProtectedRoute />} />
      <Route path="/pricing" element={isAuthenticated ? <Pricing /> : <Navigate to="/login" replace />} />
      <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" replace />} />
      <Route path="/payment-success" element={isAuthenticated ? <PaymentSuccess /> : <Navigate to="/login" replace />} />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/content" : "/register"} replace />}
      />
    </Routes>
  );
};

export default App;
