import "./App.css"
import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {TextField, Button} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import fetchUserDetails from "./FetchSubmit.js"
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
//import {fetchUserDetails, handleSubmit} from "./FetchSubmit.js"

//return data only?
//but functions are called within whatever html stuff itself
//

const UserDetails = ({selectedUserId, setSelectedUserId}) =>{
    const url = "/saveUserDetails";
    //const [userDetails, setUserDetails] = useState(null);
    const [id, setId] = useState(selectedUserId);
    console.log("in UserDetails component: " + id);
    //console.log(selectedUserId);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [org, setOrg] = useState(null);
    const [address, setAddress] = useState(null);
    const [city, setCity] = useState(null);
    const [locstate, setLocState] = useState(null);
    const [country, setCountry] = useState(null);
    const [postal, setPostal] = useState(null);

    let userDetails = [
        {username: {username}},
        {email: {email}},
        {organization: {org}},
        {address: {address}},
        {city: {city}},
        {state: {locstate}},
        {country: {country}},
        {postalcode: {postal}},
    ];

    useEffect(() => {
    if (!id){
        return;
      }
      const fetchData = async () => {
         const data = await fetchUserDetails(id);
         if (data) {
                setUsername(data[0].username);
                setEmail(data[0].email);
                setOrg(data[0].organization);
                setAddress(data[0].address);
                setCity(data[0].city);
                setLocState(data[0].state);
                setCountry(data[0].country);
                setPostal(data[0].postalcode);
            }
      }

      fetchData();
    }, [id]);

    const callHandleSubmit = async(event) => {
        console.log("57");
        console.log("http://127.0.0.1:5000" + url + "/");
        const newUrl = ("http://127.0.0.1:5000", url, "/");
        console.log(newUrl);
        handleSubmit(userDetails, "http://127.0.0.1:5000/saveUserDetails/");
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        setSelectedUserId(null);
        const settings = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id,
                username,
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
            const fetchResponse = await fetch('http://127.0.0.1:5000/saveUserDetails/', settings);
            const data = await fetchResponse.json();
            setSelectedUserId(null);
            return data;
        } catch (e){
            return e;
        }
    }

    const updateSelectedId = () => {
        setSelectedUserId(null);
    }

    //const handleUserClick = (selectedUserId) => {
        //updateSelectedId();
    //}

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!id) return null;

    if (email){
        if (id){
            //console.log(id);
            console.log(userDetails);
            console.log("email: " + email);
            console.log("updated");
            //console.log(userDetails[0].password);
            //state variables: email, organization, etc, initialize, fill in, will be changed as well
            return(
            <>
                <TableCell><p></p></TableCell>
                <TableCell><TextField id="email" label="Email:" defaultValue={email} onChange={(e)=>setEmail(e.target.value)}/></TableCell>
                <TableCell><TextField id="org" label="Organization:" defaultValue={org} onChange={(e)=>setOrg(e.target.value)}/></TableCell>
                <TableCell><TextField id="address" label="Address:" defaultValue={address} onChange={(e)=>setAddress(e.target.value)}/></TableCell>
                <TableCell><TextField id="city" label="City:" defaultValue={city} onChange={(e)=>setCity(e.target.value)}/></TableCell>
                <TableCell><TextField id="locstate" label="State:" defaultValue={locstate} onChange={(e)=>setLocState(e.target.value)}/></TableCell>
                <TableCell><TextField id="country" label="Country:" defaultValue={country} onChange={(e)=>setCountry(e.target.value)}/></TableCell>
                <TableCell><TextField id="postal" label="Postalcode:" defaultValue={postal} onChange={(e)=>setPostal(e.target.value)}/></TableCell>
                <Button onClick={handleSubmit}><SaveIcon /></Button>
            </>
            );
            //material ui button
        }
        else {
            return <p></p>;
        }
    }
    else {
        return <p>Click a user to display their details.</p>;
    }
};


const UserData = ({id}) => {
    //console.log("email: " + user.email);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [org, setOrg] = useState(null);
    const [address, setAddress] = useState(null);
    const [city, setCity] = useState(null);
    const [locstate, setLocState] = useState(null);
    const [country, setCountry] = useState(null);
    const [postal, setPostal] = useState(null);

    useEffect(() => {
      if (!id){
        return;
      }
      const fetchData = async () => {
         const data = await fetchUserDetails(id);
         if (data) {
                setUsername(data[0].username);
                setEmail(data[0].email);
                setOrg(data[0].organization);
                setAddress(data[0].address);
                setCity(data[0].city);
                setLocState(data[0].state);
                setCountry(data[0].country);
                setPostal(data[0].postalcode);
            }
      }

      fetchData();
    }, [id]);


    return (
    <>
        <TableCell>{username}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{org}</TableCell>
        <TableCell>{address}</TableCell>
        <TableCell>{city}</TableCell>
        <TableCell>{locstate}</TableCell>
        <TableCell>{country}</TableCell>
        <TableCell>{postal}</TableCell>
    </>
    ); //here--return these as variables instead.
    //then in getrows...
};


export default function UserList({users}) {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [rowData, setRowData] = useState(users);
    const [editData, setEditData] = useState({});

    const handleUserClick = (id) => {
        if (selectedUserId && selectedUserId === id){
            setSelectedUserId(null);
        }
        else{
            setSelectedUserId(id);
        }
        console.log("selecteduserid " + selectedUserId);
        console.log("id " + id);
    };

    useEffect(() => {
        //fetchUsers();
        console.log(users);
    }, [users]);

    const getRows = () => {
        if (users && users.length > 0) {
            console.log(users);
            return users.map((user) => {
        return (
            <TableRow>
                <>
                <>{!(selectedUserId === user.id) && <UserData id={user.id}/>}</>
                {(selectedUserId !== null && selectedUserId === user.id) ? <UserDetails selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId}/> : <TableCell onClick={() => {handleUserClick(user.id);}}><EditIcon /></TableCell>}
                </>
            </TableRow>

            );
            //{!(selectedUserId === user.id) && <td onClick={() => {handleUserClick(user.id);}}>Edit {user.username} data</td>}

        });
        }
        return(
        <></>
        );
    }
//<div class="inline_grid" onClick={() => {handleUserClick(user.id);}}><button >Edit {user.username} data</button></div>
    //.id or .username?
    return(

        <TableContainer>
        <Table>
        <TableHead>
        <TableRow
        sx={{
              "& th": {
                fontSize: "1rem",
                color: "white",
                backgroundColor: "gray"
              }
            }}
        >
            <TableCell>Username:</TableCell>
            <TableCell>Email:</TableCell>
            <TableCell>Organization:</TableCell>
            <TableCell>Address:</TableCell>
            <TableCell>City:</TableCell>
            <TableCell>State:</TableCell>
            <TableCell>Country:</TableCell>
            <TableCell>Postal Code:</TableCell>
            <TableCell>Edit:</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
            {getRows(users)}
        </TableBody>
        </Table>
        </TableContainer>


    );

}

//UserList.propTypes = {
    //users: PropTypes.arrayOf
//}