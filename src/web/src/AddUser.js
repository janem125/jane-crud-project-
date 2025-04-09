import "./App.css"
import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import {fetchUserDetails, handleSubmit} from "./FetchSubmit.js"; //these might want specific items to be imported
import {UserDetails, UserData, UserList} from "./DisplayInfo.js";

//pass setUserAdded necessary  or not?

const AddNewUser = () => {
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);

        const [username, setUsername] = useState(null);
        const [pass, setPass] = useState(null);
        const [email, setEmail] = useState(null);
        const [org, setOrg] = useState(null);
        const [address, setAddress] = useState(null);
        const [city, setCity] = useState(null);
        const [locstate, setLocState] = useState(null);
        const [country, setCountry] = useState(null);
        const [postal, setPostal] = useState(null);

        const [userDetails, setUserDetails] = useState({
            username: username,
            email: email,
            organization: org,
            address: address,
            city: city,
            state: locstate,
            country: country,
            postalcode: postal,
        });

        if (isLoading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;

        return(
            <Stack p={2}>
                <form method="post" action="/post" onSubmit={handleSubmit}>
                    <td><TextField id="user" label="Username:" onChange={(e)=>setUsername(e.target.value)}/></td>
                    <td><TextField id="email" label="Email:" onChange={(e)=>setEmail(e.target.value)}/></td>
                    <td><TextField id="org" label="Organization:" onChange={(e)=>setOrg(e.target.value)}/></td>
                    <td><TextField id="address" label="Address:" onChange={(e)=>setAddress(e.target.value)}/></td>
                    <td><TextField id="city" label="City:" onChange={(e)=>setCity(e.target.value)}/></td>
                    <td><TextField id="locstate" label="State:" onChange={(e)=>setLocState(e.target.value)}/></td>
                    <td><TextField id="country" label="Country:" onChange={(e)=>setCountry(e.target.value)}/></td>
                    <td><TextField id="postal" label="Postalcode:" onChange={(e)=>setPostal(e.target.value)}/></td>
                    <td><Button onClick={async(event)=>{console.log("button clicked")
                        await handleSubmit({
                        username: username,
                        email: email,
                        organization: org,
                        address: address,
                        city: city,
                        state: locstate,
                        country: country,
                        postalcode: postal,
                    }, "http://localhost:5000/addNewUser/")
                    }}>Update</Button></td>
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