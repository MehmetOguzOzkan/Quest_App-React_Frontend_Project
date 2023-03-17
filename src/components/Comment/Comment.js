import React from 'react'
import {CardContent,OutlinedInput,InputAdornment,Avatar} from '@mui/material'
import {Link} from 'react-router-dom'

export default function Comment(props) {
    const {text,userId,userName}=props;
    
    return (
        <CardContent sx={{display:"flex",flexWrap:"wrap",justifyContent:"flex-start",alignItems:"center"}}>
            <OutlinedInput
            id="outlined-adorment-amount" 
            multiline 
            imputProps = {{maxLength : 150}}
            fullWidth
            sx={{color:"black",backgroundColor:"white"}} 
            disabled 
            value={text}
            startAdornment = {
                <InputAdornment position='start'>
                    <Link style={{textDecoration:"none",boxShadow:"none",color:"white"}} to={{pathname : "/users/" + userId}}>
                        <Avatar aria-label="recipe">
                            {userName.charAt(0).toUpperCase()}
                        </Avatar>
                    </Link>
                </InputAdornment>
            }/>
        </CardContent>
    )
}
