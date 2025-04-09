import "./App.css"
//import React from "react";
//import {useEffect, useState} from "react";


const url = "http://localhost:5000";
//!!! passing info to async() funcs

export async function handleSubmit(user, passurl) {
    console.log(user);

        const settings = {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                user
            ),
        };
        try{
            const newUrl = url + passurl;
            console.log("newurl ", newUrl);
            console.log(url, passurl, "/");
            const fetchResponse = await fetch(passurl, settings);
            const data = await fetchResponse.json();
            return data;
        } catch (e){
            console.log(passurl);
            console.log(e);
        }

};


export async function fetchUserDetails (id)  {

    try{
        console.log(id);
        const response = await fetch(`http://localhost:5000/userDetails/${id}`);
        //something similar to await fetch to do post
        //console.log(response);
        if (!response.ok){
            throw new Error("failed to fetch details");
        }
        const resp = await response.json();
        const data = JSON.parse(JSON.stringify(resp));
        return data;

    } catch (err) {
        console.log(err);
    }

};