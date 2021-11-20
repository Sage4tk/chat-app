import { useEffect, useState } from "react"
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase/compat";
import { useRoomSet } from "../context/RoomContext";

const ChatNav: React.FC<any> = (props) => {
    //context
    const setRoom:any = useRoomSet();

    //display toggle
    const [chatlist, setChatList] = useState(false);
    
    const { displayName, photoURL } = props.logged;

    const image = {
        backgroundImage: `url(${photoURL})`
    }

    const logOut = () => {
        props.auth.signOut();
        setRoom(null);
    }

    return (
        <nav>
            <div className="user-avatar" style={image}>
                <div className="user-info">
                    <p>{displayName}</p>
                    <button onClick={() => {logOut()}}>Log Out</button>
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
    //userinfo
    const { photoURL, uid, displayName } = props.user

    //hide when added and let async kick in
    const [hide, setHide] = useState(false);

    const hideStyle = {
        display: "none"
    }

    //chatroom ref
    const roomRef = props.db.collection('chat-rooms');
    const ordered = roomRef.orderBy('created_at');
    const [rooms] = useCollectionData(ordered, {idField:'id'});

    //user ref
    const userRef = firebase.firestore().collection('users-saved');

    const findUser = userRef.where('user', '==', uid)
    const [userDb]:any = useCollectionData(findUser, {idField: "id"});

    const [formHandler, setFormHandler] = useState("");


    const createRoom = async(e:any) => {
        e.preventDefault();
        setHide(true);
        //docref
        let addId:any;

        if (!formHandler.trim().length) {
            alert('Please put in the room name.')
        } else {
            await roomRef.add({
                room_name: formHandler,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                avatar: photoURL,
                members: [
                    {
                        name: displayName,
                        avatar: photoURL,
                        uid: uid
                    }
                ]
            }).then((docRef:any) => {
                addId = docRef.id;
            });

            //clearout form
            setFormHandler('');

            //add created room to users list
            if (userDb?.length === 0) {
                
                userRef.add({
                    user: uid,
                    rooms: [addId]
                })
                setHide(false);
                props.setChatList(false)
                
            } else {
                
                userRef.doc(userDb[0].id).update({
                    rooms: [...userDb[0].rooms, addId]
                })
                setHide(false);
                props.setChatList(false)
                
            }
        }
    }

    if (!props.display) return (null)

    return (
        <div className="add-chatroom" style={hide?{display:'none'}:{display:"flex"}}>
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
    const { uid, photoURL, displayName } = props.user;

    const userRef = firebase.firestore().collection('users-saved');
    const roomRef = firebase.firestore().collection('chat-rooms');

    const findUser = userRef.where('user', '==', uid);
    const findRoom = roomRef.where(firebase.firestore.FieldPath.documentId(), "==", id)

    const [room]:any = useCollectionData(findRoom, {idField: 'id'});
    const [usar]:any = useCollectionData(findUser, {idField: 'id'});

    const addToList = async() => {
        //if no one is added
        if (usar?.length === 0) {
            await userRef.add({
                user: uid,
                rooms: [id]
            })
            //add user to room list
            await roomRef.doc(room[0].id).update({
                members: [...room[0].members, {
                    name: displayName,
                    avatar: photoURL,
                    uid: uid
                }]
            })
        } else {
            if (usar[0].rooms.includes(id)) {
                alert('you already have this room added');
            } else {
                //add room to user
                await userRef.doc(usar[0].id).update({
                    rooms: [...usar[0].rooms, id]
                })
                //add user to room list
                await roomRef.doc(room[0].id).update({
                    members: [...room[0].members, {
                        name: displayName,
                        avatar: photoURL,
                        uid: uid
                    }]
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