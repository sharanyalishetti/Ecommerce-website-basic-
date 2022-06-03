import React from 'react'
import {useForm} from "react-hook-form"
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'

function Signup() {

  const {register,handleSubmit,formState : {errors}} = useForm()

  //state for image
  let [img, setImg] = useState(null);

  const onImageSelect = (event) => {
    setImg(event.target.files[0]);

    console.log(event.target.files[0]);
    console.log(event)
  }
  const navigate = useNavigate()
  const onFormSubmit = (userObj) => {

    //create FormData Object
    let formData = new FormData();
    //append values to it
    formData.append("userObj",JSON.stringify(userObj));
    formData.append("photo",img)

    //http post request
    axios.post('http://localhost:4000/user-api/create-user',formData)
    .then(response => {
      alert('New User Created')
      //navigate to login component
      if(response.data.message === 'New user created') {
        navigate('/login')
      }
    })
    .catch(error =>{
      alert("Something went wrong in creating user")
    })
  }

  return (
    <div>
      <p className='display-4 text-info text-center'>Sign Up</p>
      <form  className='w-50 mx-auto' onSubmit={handleSubmit(onFormSubmit)} >
        {/* Username */}
        <div className="mt-3">
          <label htmlFor="username">username</label>
          <input type="text" id="username" className="form-control" {...register("username", {required : true})}/>
        </div>
        {/* Validation error message for username */}
        {errors.username && <p className='text-danger'>*Username is required</p>}


        {/* Password */}
        <div className="mt-3">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" className="form-control" {...register("password", {required : true})} />
        </div>
        {/* Validation error message for username */}
        {errors.password && <p className='text-danger'>*password is required</p>}


        {/* Email */}
        <div className="mt-3">
          <label htmlFor="email">Email</label>
          <input type="email"  id="email" className='form-control' {...register("email", {required : true})} />
        </div>
        {/* Validation error message for username */}
        {errors.email && <p className='text-danger'>*Email is required</p>}


        {/* City */}
        <div className="mt-3">
          <label htmlFor="city">City</label>
          <input type="text" id="city" className="form-control" {...register("city", {required : true})} />
        </div>
        {/* Validation error message for username */}
        {errors.city  && <p className='text-danger'>*City is required</p>}

        {/* Image */}
        <div className="mt-3">
          <label htmlFor="photo">City</label>
          <input type="file" id="photo" className="form-control" {...register("photo", {required : true})} onChange = {(event) => onImageSelect(event)} />
        </div>
        {/* Validation error message for username */}
        {errors.image  && <p className='text-danger'>*profile image is required</p>}

        {/* Submit button */}
        <div className="mt-5">
          <button type="submit" className='btn btn-success d-block mx-auto'>Sign up</button>
        </div>
      </form>
    </div>
  )
}

export default Signup