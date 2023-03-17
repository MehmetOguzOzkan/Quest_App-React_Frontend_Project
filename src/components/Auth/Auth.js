import React,{useState} from 'react'
import {FormHelperText,Input,InputLabel,Button,FormControl} from '@mui/material'
import {PostWithoutAuth} from '../../services/HttpService'

export default function Auth() {
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');

    const handleUsername = (value) => {
        setUsername(value);
    }

    const handlePassword = (value) => {
        setPassword(value);
    }

    const sendRequest = (path) => {
        PostWithoutAuth("/auth/"+path,{
            userName : username,
            password : password,
        })
        .then((res)=>res.json())
        .then((result)=>{localStorage.setItem("tokenKey",result.accessToken);
                        localStorage.setItem("currentUser",result.userId);
                        localStorage.setItem("userName",username);
                        localStorage.setItem("refreshKey",result.refreshToken)})
        .catch((err)=>console.log(err))
    }

    const handleButton=(path)=>{
        sendRequest(path);
        setUsername("");
        setPassword("");
        console.log(localStorage);
    }

    return(
        <FormControl fixed style={{marginTop:'5%',marginBottom:"20%",}}>
            <InputLabel>Username</InputLabel>
            <Input onChange={(b)=>handleUsername(b.target.value)}/>
            <InputLabel style={{top:80}}>Password</InputLabel>
            <Input style={{top:40}} onChange={(b)=>handlePassword(b.target.value)}/>
            <Button variant='contained'
                style={{marginTop:60,background:"linear-gradient(45deg, #2196F3 30%,#21CBF3 90%)",
            color:"white"}}
            onClick={()=>handleButton("login")}>Login</Button>
            <FormHelperText style={{marginTop:100}}>Don't have an account?</FormHelperText>
            <Button variant='contained'
                style={{background:"linear-gradient(45deg, #ffe7ba 30%, #fa8072 75%)",
            color:"white"}}
            onClick={()=>handleButton("register")}>Register</Button>
        </FormControl>
    )
}
