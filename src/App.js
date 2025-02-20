import "./App.css"
import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
//import AddUser from "./AddUser.js";
import UserList from "./DisplayInfo.js";
import handleSubmit from "./FetchSubmit.js";
import Stack from '@mui/material/Stack';
import Grid from "@mui/material/Grid";
import { positions } from '@mui/system';



//remove all adduser related stuff outside of app, but still within file
//once it runs, move to adduser file + reinstate import


const App = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAdded, setUserAdded] = useState(true);
    const [addUsr, setAddUsr] = useState(false);
    const [lastItem, setLastItem] = useState(null);
    console.log("268 adduser is " + addUsr);

    const fetchUsers = async() => {
        console.log("271 fetchusers");
            try{
                console.log("273");
                const response = await fetch("http://127.0.0.1:5000/userlist");

                if (!response.ok) {
                    throw new Error('failed to fetch users');
                }
                const data = await response.json();
                console.log("280");
                console.log(data);
                setUsers(data);
                console.log(users);
                //copy how a new user is added to users under displayinfo
                //(if that's easily picked out, isolate it into its own func and call here?)
                if (users){ //can see that users here is updated, but the page itself doesn't display...
                    setLastItem(((users).length) -1);
                    console.log("281");
                    console.log(users[lastItem]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }

    };

    useEffect(() => {
    //it only sets users at the start because this is initially called
    //have to call useEffect again somehow in order to make changes happen again
    //could UserList itself be edited so that it itself does fetchusers when needed
    //instead of passing users to userlist, could it set users on its own?
        //fetchUsers();
        console.log(users);
    }, [users]);

    if (userAdded){
        setUserAdded(!userAdded);
        fetchUsers();
    }

    const AddNewUser = () => {
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);

        const [user, setUser] = useState(null);
        const [pass, setPass] = useState(null);
        const [email, setEmail] = useState(null);
        const [org, setOrg] = useState(null);
        const [address, setAddress] = useState(null);
        const [city, setCity] = useState(null);
        const [locstate, setLocState] = useState(null);
        const [country, setCountry] = useState(null);
        const [postal, setPostal] = useState(null);

        let userDetails = [
            {username: {user}},
            {password: {pass}},
            {email: {email}},
            {organization: {org}},
            {address: {address}},
            {city: {city}},
            {state: {locstate}},
            {country: {country}},
            {postalcode: {postal}},
        ];

        //!!!
        //const submitdata = handleSubmit(userDetails, "addNewUser/");
        //if submitdata {
            //fetchUsers();
        //}
        const handleSubmit = async(event) => {
            console.log("submit pressed");
            setAddUsr(!addUsr);
            console.log("328 adduser is " + addUsr);
            event.preventDefault();
            const settings = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user,
                    pass,
                    email,
                    org,
                    address,
                    city,
                    locstate,
                    country,
                    postal,
                }),
            };
            try{
                const fetchResponse = await fetch('http://127.0.0.1:5000/addNewUser/', settings);
                const data = await fetchResponse.json();
                console.log("351");
                fetchUsers();
                return data;
            } catch (e){
                console.log("355");
                fetchUsers();
                return e;
            }
            fetchUsers();
        }

        if (isLoading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;

        return(
            <Stack p={2}>
                <form method="post" action="/post" onSubmit={handleSubmit}>
                    <td><TextField id="user" label="Username:" onChange={(e)=>setUser(e.target.value)}/></td>
                    <td><TextField id="email" label="Email:" onChange={(e)=>setEmail(e.target.value)}/></td>
                    <td><TextField id="org" label="Organization:" onChange={(e)=>setOrg(e.target.value)}/></td>
                    <td><TextField id="address" label="Address:" onChange={(e)=>setAddress(e.target.value)}/></td>
                    <td><TextField id="city" label="City:" onChange={(e)=>setCity(e.target.value)}/></td>
                    <td><TextField id="locstate" label="State:" onChange={(e)=>setLocState(e.target.value)}/></td>
                    <td><TextField id="country" label="Country:" onChange={(e)=>setCountry(e.target.value)}/></td>
                    <td><TextField id="postal" label="Postalcode:" onChange={(e)=>setPostal(e.target.value)}/></td>
                    <td><input type="submit" className="btn" value="Update"/></td>
                </form>
            </Stack>
            );
    }

    const AddUser = () => {
        const handleUserClick = () => {
            if (addUsr === true){
                setUserAdded(true);
                fetchUsers();
                console.log("384 adduser is " + addUsr);
            }
            setAddUsr(!addUsr);
            fetchUsers();
            console.log("388 adduser is " + addUsr);
            //console.log("add user button pressed");
        }
        //fetchUsers();

        return(
        <>
            <Button onClick={handleUserClick} alignItems="end" position="fixed" p={2}>Add User</Button>
            {addUsr && <AddNewUser />}
        </>
        );
    }

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>;

    //sx={{
    //position:"absolute"
    //}}

    return(
        <Container>
        <div>
        <Stack p={2} alignItems="end">
            <AddUser/>
        </Stack>
        </div>
        <div>
        <Stack p={2} alignItems="center" style={{width:"100%"}}>
            <UserList users={users}/>
        </Stack>
        </div>
        </Container>
    );
};

export default App;