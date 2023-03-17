import React,{useState,useEffect} from 'react'
import Post from '../Post/Post'
import PostForm from '../Post/PostForm'

export default function Home() {
    const [error,setError]=useState(null);
    const [isLoaded,setIsLoaded]=useState(false);
    const [postList,setPostList]=useState([]);

    const refreshPosts=()=>{
        fetch("/posts").
        then(res=>res.json()).
        then(
            (result)=>{
                setIsLoaded(true);
                setPostList(result);
            },
            (error)=>{
                console.log(error);
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    useEffect(()=>{
        refreshPosts();
    },[])

    if(error){
        return(
            <div>404 Not Found!</div>
        )
    }else if(!isLoaded){
        return(
            <div>Loading...</div>
        )
    }else{
        return(
            <div fixed style={{flexWrap:'wrap',display:'flex',bgcolor:'#f0f5ff',alignItems:'center',justifyContent:'center'}}>
                {
                    localStorage.getItem("currentUser") == null ? "" 
                    : <PostForm refreshPosts={refreshPosts} userId={localStorage.getItem("currentUser")} userName={localStorage.getItem("userName")}/>
                }
                {postList.map(post=>(
                    <Post likes={post.postLikes} postId={post.id} title={post.title} text={post.text} userId={post.userId} userName={post.userName}/>
                ))}
            </div>
        )
    }
}
