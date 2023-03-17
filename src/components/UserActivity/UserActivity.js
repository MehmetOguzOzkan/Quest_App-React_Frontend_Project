import React,{useState,useEffect} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close';
import {AppBar,Toolbar,IconButton,Slide,Dialog,Typography} from '@mui/material'
import Post from '../Post/Post'
import {GetWithAuth,PostWithAuth} from '../../services/HttpService'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PopUp(props){
  const {isOpen,postId,setIsOpen}=props;
  const [open, setOpen] = useState(isOpen);
  const [post,setPost] = useState(null);

  const getPost = () => {
    GetWithAuth("/posts/"+postId)
    .then(res=>res.json())
    .then(
      (result)=>{
        console.log(result);
        setPost(result);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  useEffect(()=>{
    setOpen(isOpen);
  },[isOpen]);

  useEffect(()=>{
    getPost();
  },[postId]);

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
  };

  return(
    <Dialog
      fullScreen
      open={open}
      onClose={()=>handleClose()}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={()=>handleClose()}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Close
          </Typography>
        </Toolbar>
      </AppBar>
      {post? <Post likes={post.postLikes} postId={post.id} userId={post.userId} userName={post.userName}
      title={post.title} text={post.text}></Post> : "Loading"}
    </Dialog>
  );
}

export default function UserActivity(props) {
    const [error,setError]=useState(null);
    const [isLoaded,setIsLoaded]=useState(false);
    const [rows,setRows]=useState([]);
    const [selectedPost,setSelectedPost]=useState(null);
    const [isOpen,setIsOpen]=useState(false);
    const {userId} = props;

    const getActivity = () => {
        GetWithAuth("/users/activity/"+userId)
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                console.log(result);
                setRows(result);
            },
            (error) => {
                console.log(error);
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    const handleNotification = (postId) => {
      setSelectedPost(postId);
      setIsOpen(true);
    };

    useEffect(()=>{
        getActivity();
    },[])

  return (
    <div>
      {isOpen ? <PopUp isOpen={isOpen} postId={selectedPost} setIsOpen={setIsOpen}/> : ""}
      <Paper sx={{ width: '100%', overflow: 'hidden', marginLeft:5 }}>
        <TableContainer sx={{ maxHeight: 440, maxWidth:800,minWidth:100 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                  User Activities
              </TableRow>
            </TableHead>
            <hr/>
            <TableBody>
              {
                  rows.map((row)=>{
                      return(
                        <Button onClick={()=>handleNotification(row[1])}>
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                              <TableCell>
                                {row[3] + " " + row[0] + " your post"}
                              </TableCell>
                          </TableRow>
                        </Button>
                      )
                  })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}