import { useRoom } from "../context/RoomContext";
import firebase from "firebase/compat";
import { useCollectionData, useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { useEffect, useRef, useState } from "react";

const MessagingBox: React.FC<any> = (props) => {
    const room = useRoom();

    const messageRef = firebase.firestore().collection(`chat-rooms/${room}/messages`);
    const roomRef = firebase.firestore().collection('chat-rooms')
    //order query
    const ordered = messageRef.orderBy('created_at');
    const [message] = useCollectionData(ordered, {idField:"id"});

    //getroom name
    const findRoom = roomRef.where(firebase.firestore.FieldPath.documentId(), "==", String(room));
    const [roomName]:any = useCollectionDataOnce(findRoom, {idField: "id"});

    const [inputText, setInputText] = useState<string>('');

    const { photoURL, displayName, uid } = props.user;

    const boxRef:any = useRef(null);

    //scroll to bottom command;
    const scrollbottom = () => {
        boxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }

    //roomname state
    const [chatName, setChatName] = useState<any>(null)

    useEffect(() => {
        scrollbottom();
    }, [message])

    useEffect(() => {
        if (!roomName) {
            return;
        }
        if (roomName.length !== 0) {
            setChatName(roomName[0].room_name);
        }
    }, [roomName])

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
            <div className="chat-roomname">
                <h1>{chatName}</h1>
            </div>
            <div className="chat-box" >
                {message && message.map((e) => (<Message key={e.id} data={e}/>))}
                <div ref={boxRef}></div>
            </div>
            <MemberList room={room} />
            <form onSubmit={sendText}>
                <div>
                    <input type="text" value={inputText} onChange={(e) => {setInputText(e.target.value)}}/>
                    <button type="submit">submit</button>
                </div>
            </form>
            
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
        <div className="member-list">
            <h2>Members</h2>
            <div>
                {members[0].members && members[0].members.map((data:any) => <NameList data={data} key={data.uid}/> )}
            </div>
        </div>
    )
}

interface NameReq {
    data: undefined | object | any ,
    key: string
}

const NameList: React.FC<NameReq> = (props) => {

    return (
        <div className="member-box">
            <img src={props.data.avatar} />
            <div>
                <p>{props.data.name}</p>
            </div>
        </div>
    )
}

export default MessagingBox;