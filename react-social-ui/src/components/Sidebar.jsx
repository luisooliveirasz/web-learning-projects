import { NavLink } from "react-router-dom"
import "./Sidebar.css"

export default function Sidebar() {
    return (
        <nav className="sidebar">
            <h2>Título</h2>
            <div className="nav-links">
                <NavLink to="/" className="nav-item"><i class="fa-solid fa-house"></i> Home</NavLink>
                <NavLink to="/notifications" className="nav-item"><i class="fa-solid fa-bell"></i> Notificações</NavLink>
                <NavLink to="/profile/luis" className="nav-item"><i class="fa-solid fa-user"></i> Perfil</NavLink>
            </div>
            
        </nav>
    );
}