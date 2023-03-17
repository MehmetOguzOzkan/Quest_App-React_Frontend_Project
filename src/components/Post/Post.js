import React,{useState,useEffect,useRef} from 'react';
import {Link} from 'react-router-dom'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment'
import Container from '@mui/material/Container'
import Comment from '../Comment/Comment'
import CommentForm from '../Comment/CommentForm'
import {PostWithAuth,DeleteWithAuth} from "../../services/HttpService"

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

export default function Post(props) {
    const {postId,title,text,userId,userName,likes}=props;
    const [expanded, setExpanded] = useState(false);
    const [isLoaded,setIsLoaded]=useState(false);
    const [error,setError]=useState(null);
    const [commentList,setCommentList]=useState([]);
    const [isLiked,setIsLiked]=useState(false);
    const isInitalMount = useRef(true);
    const [likeCount,setLikeCount]=useState(likes.length);
    const [likeId,setLikeId]=useState(null);
    const [refresh,setRefresh]=useState(false);
    let disabled = localStorage.getItem("currentUser") == null ? true:false;

    const setCommentRefresh = () => {
       setRefresh(true); 
    }

    const handleExpandClick = () => {
      setExpanded(!expanded);
      refreshComments();
      console.log(commentList);
    };
    
    const handleLike = () => {
        setIsLiked(!isLiked);
        if(!isLiked){
            saveLike();
            setLikeCount(likeCount+1);
        }else{
            deleteLike();
            setLikeCount(likeCount-1);
        }
    };

    const refreshComments=()=>{
        fetch("/comments?postId="+postId)
        .then(res=>res.json())
        .then(
            (result)=>{
                setIsLoaded(true);
                setCommentList(result);
            },
            (error)=>{
                console.log(error);
                setIsLoaded(true);
                setError(error);
            }
        )
        setRefresh(false);
    }

    const saveLike=()=>{
        PostWithAuth('/likes',{
            postId:postId,
            userId:localStorage.getItem("currentUser"),
        })
        .then((res)=>res.json())
        .catch((err)=>console.log(err))
    }

    const deleteLike=()=>{
        DeleteWithAuth("/likes/"+likeId)
        .catch((err)=>console.log(err))
    }

    useEffect(()=>{
        if(isInitalMount.current){
            isInitalMount.current=false;
        }else{
            refreshComments();
        }
    },[refresh])

    const checkLikes = () => {
        var likeControl = likes.find((like => ""+like.userId===localStorage.getItem("currentUser")));
        if(likeControl!=null){
            setLikeId(likeControl.id);
            setIsLiked(true);
        }
    }

    useEffect(()=>{
        checkLikes()
    },[])



    return(
            <Card sx={{ width: 800 ,textAlign:'left',margin:5 }}>
                <CardHeader
                    avatar={
                        <Link style={{textDecoration:"none",boxShadow:"none",color:"white"}} to={{pathname : "/users/" + userId}}>
                            <Avatar sx={{background:"linear-gradient(45deg, #6495ed 30%, #087EB0 75%)",color:"white"}} aria-label="recipe">
                                {userName.charAt(0).toUpperCase()}
                            </Avatar>
                        </Link>
                    }
                    title={title}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    {
                        disabled ?
                        <IconButton disabled onClick={handleLike} aria-label="add to favorites">
                        <FavoriteIcon sx={isLiked?{color : "coral"}:null} />
                        </IconButton>
                        :
                        <IconButton onClick={handleLike} aria-label="add to favorites">
                        <FavoriteIcon sx={isLiked?{color : "coral"}:null} />
                        </IconButton>
                    }
                    {likeCount}
                    <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    >
                    <CommentIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Container fixed>
                        {
                            disabled ? "" :
                            <CommentForm setCommentRefresh={setCommentRefresh} postId={postId} userId={localStorage.getItem("currentUser")} userName={localStorage.getItem("userName")}/>
                        }
                        {error ? "error":
                        isLoaded ? commentList.map(comment=>(
                            <Comment userId={comment.userId} userName={comment.userName} text={comment.text}/>
                        )):"Loading"}
                    </Container>
                </Collapse>
            </Card>
    )
}
