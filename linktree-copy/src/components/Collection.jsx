import "./Collection.css"

export function Collection({ text, icon, linkref }) {
    return (
        <a href={linkref} target="_blank">
            <div className="collection-container">
                <i className={`fa-brands fa-${icon}`}></i>
                <h2>{text}</h2>
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
        </a>
        
    );
}