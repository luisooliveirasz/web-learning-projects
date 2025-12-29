import "./Profile.css"
import profilePicture from "../assets/profile-picture.png"

export default function Profile() {
  return (
    <div className="profile">
        <div className="banner"></div>
        <img className="profile-picture" src={profilePicture} alt="imagem de perfil"></img>
        <div className="profile-text">
            <h1>Luís</h1>
            <h3>@luisooliveirasz</h3>
            <h4 className="bio">Vivo o lado leve do take it easy</h4>
            <i class="fa-solid fa-location-dot"></i> Mato Grosso do Sul, Brasil.
            <br/>
            <i class="fa-solid fa-link"></i> <a href="linktr.ee/luisooliveirasz">linktr.ee/luisooliveirasz</a>
        </div>
    </div>
  );
}
