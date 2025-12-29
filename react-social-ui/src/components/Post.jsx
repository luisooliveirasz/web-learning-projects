import "./Post.css"

export default function Post({ authorName, username, content }) {
    return (
        <div className="post">
            <div className="post-header"><i className="fa-solid fa-user"></i> {authorName} <span className="username">{username}</span></div>
            <div className="post-content">{content}</div>
        </div>
    );
}