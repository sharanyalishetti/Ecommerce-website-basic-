import React from 'react'
import {useSelector} from 'react-redux'
function UserProfile() {
  //get userObj form redux
  let {userObj} = useSelector(state => state.user);
  return (
    
    <div>
      <div className="card mx-auto mt-5" style={{width: "18rem;"}}>
        <img src={userObj.profileImage} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{userObj.username}</h5>
          <p className="card-text">{userObj.email}</p>
          <p className="card-text">{userObj.city}</p>
          <a href="#" className="btn btn-primary">Edit</a>
        </div>
      </div>
    </div>
  )
}

export default UserProfile