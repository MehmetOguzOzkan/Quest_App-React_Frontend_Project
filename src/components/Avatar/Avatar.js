import React,{useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal'
import { ListItemSecondaryAction,List,ListItem,Radio } from '@mui/material';
import {PutWithAuth} from '../../services/HttpService'

export default function Avatar(props) {
  const {avatarId,userId,userName} = props;
  const [open,setOpen]=useState(false);
  const [selectedValue,setSelectedValue]=useState(avatarId);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    saveAvatar();
  }

  const saveAvatar = () => {
    PutWithAuth("/users/"+localStorage.getItem("currentUser"),{
      avatar : selectedValue,
    })
    .then((res)=>res.json())
    .catch((err)=>console.log(err))
  }


  return (
    <div>
      <Card sx={{ width: 400}}>
        <CardMedia
          sx={{ height: 400 }}
          image={`/avatars/avatar-${selectedValue}.png`}
          title="User Avatar"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {userName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User Info
          </Typography>
        </CardContent>
        <CardActions>
          {localStorage.getItem("currentUser") == userId ? 
          <Button size="small" onClick={handleOpen}>Change Avatar</Button> : ""}
        </CardActions>
      </Card>
      <Modal
        sx={{display:"flex",maxWidth:200}}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <List dense sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
          {[1,2,3,4,5,6,7,8,9,10].map((key) => {
            const labelId = `checkbox-list-secondary-label-${key}`;
            return (
              <ListItem key={key}>
                <CardMedia
                sx={{ height:80, width:80 }}
                image={`/avatars/avatar-${key}.png`}
                title="User Avatar"
                />
                <ListItemSecondaryAction>
                  <Radio
                    edge="end"
                    value={key}
                    onChange={handleChange}
                    checked={""+selectedValue===""+key}
                    inputProps={{'aria-labelledby':labelId}}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Modal>
    </div>
  );
}