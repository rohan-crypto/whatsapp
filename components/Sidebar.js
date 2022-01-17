import styled from 'styled-components'
import {Avatar, Button, IconButton} from "@mui/material"
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';

// dont use the below one  
// import {Avatar} from "@mui/icons-material"

import * as EmailValidator from "email-validator"; 
import {auth, db} from "../firebase"
import {useAuthState} from "react-firebase-hooks/auth"
import {useCollection} from "react-firebase-hooks/firestore"
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import Chat from "./Chat";

function Sidebar() {

    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users','array-contains',user.email);
    // chatsSnapshot will contain list of all chats 
    // const [chatsSnapshot, loading, error] we can have loading and error objects 
    const [chatsSnapshot] = useCollection(userChatRef);

    const createChat = () => {
        const input = prompt(
            "Please enter an email address for the user you wish to chat with")
        if(!input) return null

        // now we want to check 2 things: 
        // 1. is the email entered by user valid (using email-validator)
        // 2. does the chat already exist (using react-firebase-hooks)
        if(EmailValidator.validate(input) && !chatAlreadyExists(input) 
            && input !== user.email ){
            // we need to add the chat into the database 'chats' collection
            // if it doesn't already exist and is valid 
            db.collection('chats').add({
                users: [user.email, input],
            })
        }
    }

    const chatAlreadyExists = (recepientEmail) => 
    // the following lines of code will check if the recepient email which user will 
    // enter already exists or not. This is to check if chat already exists between 
    // the 2 users or not 

    // the !! (bang) will convert resultant value into boolean

    !!chatsSnapshot?.docs.find(
        (chat) => 
            chat.data().users.find((user) => user === recepientEmail)?.length > 0
    );

    return (
        <Container>
            <Header>    
                {/* signOut() is inbuilt function for sign out */}
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
                <IconsContainer>
                {/* IconButton makes an icon as a button with a ripple effect*/}
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </IconsContainer>
            </Header>

            <Search>
                <SearchIcon/>
                <SearchInput placeholder="Search in chats" />
            </Search>

            <SidebarButton onClick={createChat}>
                Start a new chat
            </SidebarButton>

            {/* List of chats */}
            {chatsSnapshot?.docs.map((chat) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}
        </Container>
    )
}

export default Sidebar

// all the below ones are styled versions of div 
// in these `` we write the css for the styled div 
// and replace those div with Container where we want to apply the styling  
const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar{
        display: none;
    }

    -ms-overflow-style: none; /*IE and Edge*/
    scrollbar-width: none; /*Firefox*/
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color:white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding : 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

// to use custom components like here avatar use below syntax
const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover{
        opacity: 0.87;
    }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding:20px;
    border-radius:2px;
`;

// to make a styled input component
// to use full width use flex 1
const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

// use &&&{} to increase priority of the rule within {}
const SidebarButton = styled(Button)`
    width: 100%;
    color: black !important;
    &&&{
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
    background-color: whitesmoke !important;
`;