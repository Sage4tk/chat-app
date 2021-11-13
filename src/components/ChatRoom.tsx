import { Redirect } from 'react-router-dom';

//import components
import ChatNav from './ChatNav';
import MessagingBox from './MessagingBox'


interface chatProps {
    logged: any,
    auth: any,
    db: any
}

const ChatRoom:React.FC<chatProps> = (props) => {
    
    if (!props.logged) {
        return <Redirect to="/" />
    }


    return (
        <div className="chatroom">
            <ChatNav db={props.db} logged={props.logged} auth={props.auth} />
            <MessagingBox user={props.logged} />
        </div>
    )
}

export default ChatRoom;