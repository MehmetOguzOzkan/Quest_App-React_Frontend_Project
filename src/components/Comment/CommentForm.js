import React,{useState} from 'react'
import {CardContent,OutlinedInput,InputAdornment,Avatar,Button} from '@mui/material'
import {Link} from 'react-router-dom'
import {PostWithAuth,RefreshToken} from '../../services/HttpService'

export default function CommentForm(props) {
    const {postId,userId,userName,setCommentRefresh}=props;
    const [text,setText]=useState("");
    
    const logout = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("refreshKey");
        localStorage.removeItem("userName");
        window.history.go(0);
    }

    const saveComment = () => {
        PostWithAuth("/comments",{
            postId:postId,
            userId:userId,
            text:text,
        })
        .then((res)=>{
            if(!res.ok){
                RefreshToken()
                .then((res)=>{
                    if(!res.ok){
                        logout()
                    }else{
                        return res.json()
                    }
                })
                .then((result)=>{console.log(result);
                    if(result!=undefined){
                        localStorage.setItem("tokenKey",result.accessToken);
                        localStorage.setItem("refreshKey",result.refreshToken);
                        saveComment();
                        setCommentRefresh();
                    }})
                .catch((err)=>console.log(err))
            }else{
                res.json()
            }
        })
        .catch((err)=>console.log(err))
    }

    const handleSubmit = () => {
        saveComment();
        setText("");
        setCommentRefresh();
    }

    const handleChange = (value) => {
        setText(value);
    }

    return (
        <CardContent sx={{display:"flex",flexWrap:"wrap",justifyContent:"flex-start",alignItems:"center"}}>
            <OutlinedInput
            id="outlined-adorment-amount" 
            multiline 
            imputProps = {{maxLength : 150}}
            fullWidth
            onChange={(i) => handleChange(i.target.value)}
            startAdornment = {
                <InputAdornment position='start'>
                    <Link style={{textDecoration:"none",boxShadow:"none",color:"white"}} to={{pathname : "/users/" + userId}}>
                        <Avatar sx={{background:"linear-gradient(45deg, #ffe7ba 30%, #fa8072 75%)",color:"white"}} aria-label="recipe">
                            {userName.charAt(0).toUpperCase()}
                        </Avatar>
                    </Link>
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position='end'>
                    <Button variant='contained' onClick={handleSubmit} style={{background:"linear-gradient(45deg, #ffe7ba 30%, #fa8072 75%)",color:"white"}}>
                        COMMENT
                    </Button>
                </InputAdornment>
            }
            sx={{color:"black",backgroundColor:"white"}} 
            value={text}/>
        </CardContent>
    )
}
