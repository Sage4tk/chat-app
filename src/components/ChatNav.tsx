import { useEffect, useState } from "react"
import {  useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase/compat";
import { useRoomSet } from "../context/RoomContext";

const ChatNav: React.FC<any> = (props) => {
    //display toggle
    const [chatlist, setChatList] = useState(false);
    
    const { displayName, photoURL } = props.logged;

    const image = {
        backgroundImage: `url(${photoURL})`
    }

    return (
        <nav>
            <div className="user-avatar" style={image}>
                <div className="user-info">
                    <p>{displayName}</p>
                    <button onClick={() => {props.auth.signOut()}}>Log Out</button>
                </div>
            </div>
            <hr />
            <PersonalRoom user={props.logged} />
            <List display={chatlist} db={props.db} user={props.logged} setChatList={setChatList} />
            <button onClick={() => setChatList(!chatlist)} className="add">+</button>
        </nav>
    )
}

const PersonalRoom: React.FC<any> = (props) => {
    const usersRef = firebase.firestore().collection('users-saved');
    const findUser = usersRef.where("user", "==", props.user.uid);

    const [data]:any = useCollectionData(findUser, {idField: "id"});

    const setRoom = useRoomSet();

    if (data === undefined || data.length === 0) return (null)

    return (
        <div className="list-container">
            {data[0].rooms.map((e:any) => <UserRoom key={e} data={e} setRoom={setRoom} />)}
        </div>
    )
}

const UserRoom: React.FC<any> = (props) => {
    const roomRef:any = firebase.firestore().collection('chat-rooms');
    const find = roomRef.where(firebase.firestore.FieldPath.documentId(), '==', props.data);

    const [data]:any = useCollectionData(find, {idField:"id"});

    if (!data) return (null);

    const background = {
        backgroundImage: `url(${data[0].avatar})`
    }

    return (
        <div className="room-avatar" style={background} onClick={() => {props.setRoom(data[0].id)}}>
            
        </div>
    )
}

const List: React.FC<any> = (props) => {
    const roomRef = props.db.collection('chat-rooms');
    const ordered = roomRef.orderBy('created_at');
    const [rooms] = useCollectionData(ordered, {idField:'id'});

    const [formHandler, setFormHandler] = useState("");

    const { photoURL } = props.user

    const createRoom = async(e:any) => {
        e.preventDefault();
        if (!formHandler) {
            alert('Please put in the room name.')
        } else {
            await roomRef.add({
                room_name: formHandler,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                avatar: photoURL
            })
        }
    }

    if (!props.display) return (null)

    return (
        <div className="add-chatroom">
            <div className="add-inside">
                <h1>List</h1>
                <div>
                    {rooms && rooms.map(data => <RoomList key={data.id} rooms={data} user={props.user}/>)}
                </div>
                <form onSubmit={createRoom}> 
                    <input value={formHandler} onChange={(e) => setFormHandler(e.target.value)}/>
                    <button type="submit">Create Room</button>
                </form>
                <button onClick={() => props.setChatList(false)}>Close</button>
            </div>
        </div>
    )
}

const RoomList: React.FC<any> = (props) => {
    const { room_name, id } = props.rooms
    const { uid } = props.user;

    const userRef = firebase.firestore().collection('users-saved')

    const findUser = userRef.where('user', '==', uid);

    const [usar]:any = useCollectionData(findUser, {idField: 'id'});

    const addToList = async() => {
        //find if user already has the room in their account;
        // const findUser = await userRef.where('user', "==", uid).get();

        // const clearFound = findUser.docs.map(doc => doc.data());

        // //add new user if empty
        // if (clearFound.length === 0) {
        //     userRef.add({
        //         user: uid,
        //         rooms: [id]
        //     })
        // } else {
        //     console.log(clearFound);
        // }
        if (usar?.length === 0) {
            await userRef.add({
                user: uid,
                rooms: [id]
            })
        } else {
            if (usar[0].rooms.includes(id)) {
                alert('you already have this room added');
            } else {
                userRef.doc(usar[0].id).update({
                    rooms: [...usar[0].rooms, id]
                })
            }
        }
    }

    return (
        <div className="add-name">
            <p>{room_name}</p>
            <button onClick={addToList}>ADD</button>
        </div>
    )
}

export default ChatNav;