import { Redirect } from "react-router-dom"

//images
import gButton from '../img/gButton.png';
import gButtonF from '../img/gButtonF.png';

interface HomeProp {
    func: any,
    logged: any
}

const Home:React.FC<HomeProp> = (props) => {

    if (props.logged) {
        return <Redirect to="/chatroom" />
    }
    return (
        <div className="home">
            <div className="login-container">
                <h1>T's Chat-App</h1>
                <img alt="" src={gButton} onClick={() => props.func()} className="login-button" onMouseOver={e => (e.currentTarget.src = gButtonF)} onMouseOut={e => (e.currentTarget.src = gButton)} />
                {/* <button onClick={() => props.func()}>Sign in with Google Account</button> */}
            </div>
            
        </div>
    )
}

export default Home;