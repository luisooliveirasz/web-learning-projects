

import { NavLink } from "react-router-dom"
import "./Notifications.css"

export default function Notifications() {
    return (
        <nav className="notifications-header">
            <h2>Notificações</h2>
            <div className="notifications-tabss">
                <NavLink to="#" className="notifications-nav-item">Tudo</NavLink>
                <NavLink to="#" className="notifications-nav-item">Verificadas</NavLink>
                <NavLink to="#" className="notifications-nav-item">Menções</NavLink>
            </div>
        </nav>
    );
}