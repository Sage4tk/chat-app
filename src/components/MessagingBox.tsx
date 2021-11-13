import { useRoom } from "../context/RoomContext";
import firebase from "firebase/compat";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";

const MessagingBox: React.FC<any> = (props) => {
    const room = useRoom();

    const messageRef = firebase.firestore().collection(`chat-rooms/${room}/messages`);
    //order query
    const ordered = messageRef.orderBy('created_at');
    const [message] = useCollectionData(ordered, {idField:"id"});

    const [inputText, setInputText] = useState<string>('');

    const { photoURL, displayName, uid } = props.user;

    const sendText = (e:any) => {
        e.preventDefault();

        //checks if input only has spaces or blank
        if (inputText.trim().length) {
            messageRef.add({
                text: inputText,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                avatar: photoURL,
                name: displayName,
                uid: uid
            })
            setInputText('')
        }
    }

    if (!room) {
        return (
            <div>
                <h1>No data set</h1>
            </div>
        )
    }
    return (
        <div className="chat-section">
            <div className="chat-box">
                {message && message.map((e) => (<Message key={e.id} data={e}/>))}
            </div>
            <form onSubmit={sendText}>
                <input type="text" value={inputText} onChange={(e) => {setInputText(e.target.value)}}/>
                <button type="submit">submit</button>
            </form>
            <MemberList room={room} />
        </div>
    )
}

//message box
const Message: React.FC<any> = (props) => {
    return (
        <div className="message-control">
            <img src={props.data.avatar} alt={props.data.name}/>
            <div className="message-col">
                <p>{props.data.name}</p>
                <p>{props.data.text}</p>
            </div>
        </div>
    )
}

//list of member
const MemberList: React.FC<any> = (props) => {

    const memberRef = firebase.firestore().collection(`chat-rooms`);
    const findRoomMembers = memberRef.where(firebase.firestore.FieldPath.documentId(), '==', props.room);
    const [members]:any = useCollectionData(findRoomMembers, {idField: "id"});

    if (!members) return (null);
 
    return (
        <div>
            <h1>List</h1>
            <div>
                {members[0].members && members[0].members.map((data:any) => <NameList data={data} key={data}/> )}
            </div>
        </div>
    )
}

interface NameReq {
    data: undefined | object,
    key: string
}

const NameList: React.FC<any> = (props) => {


    return (
        <div>
            <h1>TEST</h1>
        </div>
    )
}

export default MessagingBox;