import { useRoom } from "../context/RoomContext";
import firebase from "firebase/compat";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect } from "react";

const MessagingBox: React.FC<any> = () => {
    const room = useRoom();

    const messageRef = firebase.firestore().collection(`chat-rooms/${room}/messages`);
    const [message] = useCollectionData(messageRef, {idField:"id"});

    if (!room) {
        return (
            <div>
                <h1>No data set</h1>
            </div>
        )
    }
    return (
        <div>
            <div className="chat=box">
                {message && message.map((e) => (<Message key={e.id} data={e}/>))}
            </div>
            
        </div>
    )
}

const Message: React.FC<any> = (props) => {
    return (
        <div>
            <p>{props.data.text}</p>
        </div>
    )
}

export default MessagingBox;