// this will return an array of users(emails) except the signed in user's email  

const getRecipientEmail = (users, userLoggedIn) => 
    users?.filter((userToFilter) => userToFilter !== userLoggedIn?.email)[0];
    
export default getRecipientEmail;
