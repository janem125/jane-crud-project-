import "./App.css"
import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import {fetchUserDetails, handleSubmit} from "./FetchSubmit.js"; //these might want specific items to be imported
import {UserDetails, UserData, UserList} from "./DisplayInfo.js";

const AddNewUser = ({addUsr}) => {
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

    const handleSubmit = async(event) => {
        console.log("submit pressed");
        //setAddUsr(!addUsr);
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
            //fetchUsers();
            return data;
        } catch (e){
            console.log("355");
            //fetchUsers();
            return e;
        }
        //fetchUsers();
    }

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return(
        <div>
            <form method="post" action="/post" onSubmit={handleSubmit}>
                <div class="inline_grid"><TextField id="user" label="Username:" onChange={(e)=>setUser(e.target.value)}/></div>
                <div class="inline_grid"><TextField id="email" label="Email:" onChange={(e)=>setEmail(e.target.value)}/></div>
                <div class="inline_grid"><TextField id="org" label="Organization:" onChange={(e)=>setOrg(e.target.value)}/></div>
                <div class="inline_grid"><TextField id="address" label="Address:" onChange={(e)=>setAddress(e.target.value)}/></div>
                <div class="inline_grid"><TextField id="city" label="City:" onChange={(e)=>setCity(e.target.value)}/></div>
                <div class="inline_grid"><TextField id="locstate" label="State:" onChange={(e)=>setLocState(e.target.value)}/></div>
                <div class="inline_grid"><TextField id="country" label="Country:" onChange={(e)=>setCountry(e.target.value)}/></div>
                <div class="inline_grid"><TextField id="postal" label="Postalcode:" onChange={(e)=>setPostal(e.target.value)}/></div>
                <div class="inline_grid"><input type="submit" className="btn" value="Update"/></div>
            </form>
            </div>
        );
}


export default function AddUser() {
    const [addUsr, setAddUsr] = useState(false);

    const handleUserClick = () => {
        if (addUsr === true){
            //setUserAdded(true);
            //fetchUsers();
            console.log("384 adduser is " + addUsr);
        }
        setAddUsr(!addUsr);
        //fetchUsers();
        console.log("388 adduser is " + addUsr);
        //console.log("add user button pressed");
    }
    //fetchUsers();

    return(
    <div>
        <button onClick={handleUserClick} type="button">Add User</button>
        {addUsr && <AddNewUser addUsr={addUsr} />}
    </div>
    );
}

