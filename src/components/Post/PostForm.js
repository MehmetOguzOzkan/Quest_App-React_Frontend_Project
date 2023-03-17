import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput'
import { InputAdornment } from '@mui/material';
import Button from '@mui/material/Button'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {PostWithAuth,RefreshToken} from '../../services/HttpService'

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));

const notify = () => toast.success('Your post is sent!', {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    draggablePercent: 60,
    theme: "colored",
});

export default function PostForm(props) {
    const {userId,userName,refreshPosts}=props;
    const [expanded, setExpanded] = useState(false);
    const [text,setText]=useState("");
    const [title,setTitle]=useState("");
    const [isSend,setIsSend]=useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const logout = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("refreshKey");
        localStorage.removeItem("userName");
        window.history.go(0);
    }

    const savePost = () => {
        PostWithAuth("/posts",{
            title:title,
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
                        savePost();
                    }})
                .catch((err)=>console.log(err))
            }else{
                res.json()
            }
        })
        .catch((err)=>console.log("error"))
    }

    const handleSubmit = () => {
        savePost();
        setIsSend(true);
        setText("");
        setTitle("");
        refreshPosts();
        notify();
    };
    const handleTitle = (value) => {
        setIsSend(false);
        setTitle(value);
    };
    const handleText = (value) => {
        setIsSend(false);
        setText(value);
    };

    return(
        <div>
            <ToastContainer/>
            <Card sx={{ width: 800 ,textAlign:'left',margin:5 }}>
                <CardHeader
                    avatar={
                        <Link style={{textDecoration:"none",boxShadow:"none",color:"white"}} to={{pathname : "/users/" + userId}}>
                            <Avatar sx={{background:"linear-gradient(45deg, #ffe7ba 30%, #fa8072 75%)",color:"white"}} aria-label="recipe">
                                {userName.charAt(0).toUpperCase()}
                            </Avatar>
                        </Link>
                    }
                    title={<OutlinedInput id='outlined-adorment-amount' 
                    multiline placeholder='Title' 
                    inputProps={{maxLength : 25}} 
                    fullWidth 
                    value={title}
                    onChange={(b) => handleTitle(b.target.value)}>

                    </OutlinedInput>}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                    {<OutlinedInput id='outlined-adorment-amount' 
                    multiline placeholder='Text' 
                    inputProps={{maxLength : 250}} 
                    fullWidth 
                    value={text} 
                    onChange={(b) => handleText(b.target.value)} 
                    endAdornment={
                        <InputAdornment position='end'><Button variant='contained' onClick={handleSubmit} style={{background:"linear-gradient(45deg, #ffe7ba 30%, #fa8072 75%)",color:"white"}}>POST</Button></InputAdornment>
                    }></OutlinedInput>}
                    </Typography>
                </CardContent>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent/>
                </Collapse>
            </Card>
        </div>
    )
}
