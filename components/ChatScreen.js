import styled from 'styled-components'
import {auth, db} from "../firebase"
import {useAuthState} from "react-firebase-hooks/auth"
import {useCollection} from "react-firebase-hooks/firestore"
import {useRouter} from "next/router"
import {Avatar, IconButton} from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Message from "./Message";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import {useState, useRef} from "react";
import firebase from 'firebase/compat/app';
import getRecipientEmail from "../utils/getRecipientEmail"
import TimeAgo from 'timeago-react'

function ChatScreen({chat, messages,}) {

    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const endOfMessageRef = useRef(null);
    const router = useRouter();
    // messagesSnapshot will contain all the messages which we have in a given chat
    const [messageSnapshot] = useCollection(db
        .collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .orderBy('timestamp','asc')
        );
    const [recipientSnapshot] = useCollection(
        db
            .collection('users')
            .where('email','==',getRecipientEmail(chat.users, user))
        );

    const showMessages = () => {
        if(messageSnapshot){
            return messageSnapshot.docs.map((message) => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ))
        }
        else{
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message}/>
            ))
        }
    }

    const scrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behaviour: 'smooth',
            block: 'start',
        });
    }

    const sendMessage = (e) => {
        e.preventDefault();

        // update the last seen 
        db.collection('users').doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            },
            {merge: true}
        );

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput("");
        scrollToBottom();
    };

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
            {/* instead of showing the default avatar, either show their uploaded */}
            {/* photo or the first character of their email */}
                {/* <Avatar/> */}
                {recipient ? 
                    (<Avatar src={recipient?.photoURL} /> ) : 
                    (<Avatar>{recipientEmail[0]}</Avatar>)
                }
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>
                            Last active:{" "}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
                            ): ("Unavailable")}
                        </p>
                    ) : (
                        <p>Loading Last active...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessageRef} />
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon/>
                <Input value={input} onChange={(e) => setInput(e.target.value)} />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>
                    Send Message
                </button>
                <MicIcon/>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container = styled.div``;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color:white;
    z-index: 100;
`;

const Header = styled.div`
    position:sticky;
    background-color:white;
    z-index:100;
    top:0;
    display:flex;
    padding:11px;
    height:80px;
    align-items:center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;
    >h3{
        margin-bottom: 3px;
        margin-bottom: -10px;
    }
    >p{
        font-size:14px;
        color:gray;
    }
`;

const HeaderIcons = styled.div``;

// this component is used to scroll again to the bottom after sending a message. 
const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;