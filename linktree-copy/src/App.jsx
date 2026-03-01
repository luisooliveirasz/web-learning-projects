import './App.css'
import { Collection } from './components/Collection'
import userIcon from './assets/user-icon.png'

function App() {

  return (
    <>
      <div className="container">
        <img className="user-icon" src={userIcon} alt="Placeholder image"></img>
        <h3 className="user-name">@luisooliveirasz</h3>

        <div className="collections-container">
          <Collection text="Instagram" icon="instagram" linkref="https://www.instagram.com/luisooliveirasz/"/>
          <Collection text="Twitter" icon="twitter" linkref="https://x.com/luisooliveirasz"/>
          <Collection text="GitHub" icon="github" linkref="https://github.com/luisooliveirasz"/>
        </div>
        
      </div>
    </>
  )
}

export default App
