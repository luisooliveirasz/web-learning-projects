import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Feed />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}