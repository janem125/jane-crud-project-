import "./App.css"
import React from "react";
import {useEffect, useState} from "react";


const url = "http://127.0.0.1:5000";
//!!! passing info to async() funcs

const fetchUserDetailsComponent = async({path}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    setIsLoading(true);
    setError(null);

    try{
        const response = await fetch(url + path);

        if (!response.ok){
            throw new Error("failed to fetch details");
        }
        const resp = await response.json();
        const data = JSON.parse(JSON.stringify(resp));
        //diff methods do diff things depending on data
        //setIsLoading(false);
        //return data;
    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
        return data;
    }
};


export default function fetchUserDetails({isLoading, Error, path}) {
    return fetchUserDetailsComponent(isLoading, Error, path);
}


const handleSubmitComponent = async(event, {path, settings}) => {
    event.preventDefault();

    try{
        const fetchResponse = await fetch(url + path, settings);
        const data = await fetchResponse.json();
        return data;
    } catch (e){
        return e;
    }
};


export function handleSubmit({event, path, settings}){
    return handleSubmitComponent(event, path, settings);
}