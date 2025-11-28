import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import { MainPage } from "./pages/MainPage";
import { Layout } from "./components/Layout";
import { TracksPage } from "./pages/TracksPage";
import { FavouritePage } from "./pages/FavouritePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <MainPage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <RegisterPage />
            </Layout>
          }
        />
        <Route
          path="/tracks"
          element={
            <Layout>
              <TracksPage />
            </Layout>
          }
        />
        <Route
          path="/my-tracks"
          element={
            <ProtectedRoute>
              <Layout>
                <FavouritePage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
