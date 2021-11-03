import { Redirect } from "react-router-dom"

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
            <button onClick={() => props.func()}>Sign in with Google Account</button>

        </div>
    )
}

export default Home;