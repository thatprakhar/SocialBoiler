import React, { useEffect, useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useHistory } from "react-router-dom";


const API_URL = "http://127.0.0.1:5000";

function ProfileCard({
  handleDeleteShow,
  handleUploadShow,
  isOwnProfile,
  name,
  image,
  profileUser,
  followers,
  setFollowers, 
  following,
  setFollowing
}) {
  
  const [followButton, setFollowButton]=useState(true);
  const history=useHistory();
  
  
  const handleFollow=()=>{
    //first check if user is logged in
    if(!localStorage.getItem("username")){
      history.push("/login")
      return;
    }
    console.log('following', profileUser);
    setFollowButton(false);

    const requestOptions = {
      method: "POST",

      headers: {
        "Content-type": "application/json; charset=UTF-8",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        followed: profileUser
      }
    };

    fetch(API_URL + "/follow", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("put request back is: ", data);
        if(data!=="success"){
          alert(data);
        }

        //update the following list in local storage
        let newFollowing=JSON.parse(localStorage.getItem("following"))
        if(newFollowing==null){
          newFollowing=[]
        }
        
        newFollowing.push(profileUser)
        

        localStorage.setItem("following", JSON.stringify(newFollowing))

        //update followers of the profile user
        setFollowers([...followers, localStorage.getItem("username")])
        
      })
      .catch(err => {
        console.log("can not update profile: " + err);
        // setError("Can not connect to server!");
      });
    
  }

  const handleUnfollow=()=>{
    console.log('unfollowing', profileUser);


    const requestOptions = {
      method: "POST",

      headers: {
        "Content-type": "application/json; charset=UTF-8",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        followed: profileUser
      }
    };

    fetch(API_URL + "/unfollow", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("put request back is: ", data);
        if(data!=="success"){
          alert(data);
        }
        
        //update the following list in local storage
        let newFollowing=JSON.parse(localStorage.getItem("following")).filter((name)=>name!==profileUser);
        localStorage.setItem("following", JSON.stringify(newFollowing))

        //update followers of the profile
        let newFollowers=followers.filter((name)=>name!==localStorage.getItem("username"))
        setFollowers(newFollowers)
        
      })
      .catch(err => {
        console.log("can not update profile: " + err);
        // setError("Can not connect to server!");
      });
    

    setFollowButton(true)
  }

  useEffect(()=>{
    console.log("following:", localStorage.getItem("following"))
    console.log("profile user:", profileUser)

    if(localStorage.getItem("following")){
      const followingArray=JSON.parse(localStorage.getItem("following"))
      if(followingArray.includes(profileUser)){
        console.log("true")
        setFollowButton(false)
      }
      else {
        setFollowButton(true)
      }
    }
   
  },[])


  return (
    <div className="profile__card">
      <Card style={{ width: "30rem" }}>
        <Card.Img
          variant="top"
          src={
            image != null
              ? image
              : "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.fansided.com%2Fwp-content%2Fblogs.dir%2F229%2Ffiles%2F2013%2F11%2F6896948.jpg&f=1&nofb=1"
          }
        />
        <Card.Body>
          <h1>
            <Badge variant="light">{name}</Badge>
          </h1>

          <h5>
            <Badge variant="info">Followers:</Badge> {followers.length}
          </h5>
          <h5>
            <Badge variant="warning">Following:</Badge> {following.length}
          </h5>
          
          <div className="text-center profile__delete">
            {isOwnProfile ? (
              <div className="profile__card__button">
                {" "}
                <Button variant="danger" onClick={handleDeleteShow}>
                  Delete Account
                </Button>
                <Button variant="success" onClick={handleUploadShow}>
                  Upload Avatar
                </Button>
              </div>
            ) : (
              followButton?(
                <Button variant="info" onClick={handleFollow}>Follow</Button>
              ):(
                <Button variant="danger" onClick={handleUnfollow}>Unfollow</Button>
              )
              
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ProfileCard;
