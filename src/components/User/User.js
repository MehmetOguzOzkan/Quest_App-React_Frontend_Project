import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import Avatar from '../Avatar/Avatar'
import UserActivity from '../UserActivity/UserActivity'
import {GetWithAuth} from '../../services/HttpService'

export default function User() {
    const {userId} = useParams();
    const [user,setUser]=useState();
    
    const getUser = () => {
        GetWithAuth("/users/"+userId)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
                setUser(result);
            },
            (error) => {
                console.log(error);
            }
        )
    }

    useEffect(()=>{
        getUser();
    },[userId]);

    return (
        <div style={{display:'flex',margin:20}}>
            {user ? <Avatar avatarId={user.avatarId} userId={userId} userName={user.userName}/> : ""}
            {localStorage.getItem("currentUser") === userId ? <UserActivity userId={userId} /> : ""}
        </div>
    )
}
