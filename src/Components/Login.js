import React from 'react'
import {useForm} from 'react-hook-form'
import {useSelector,useDispatch} from 'react-redux'
import { useEffect } from 'react'
import { userLogin } from '../slices/userSlice'
import { useNavigate } from 'react-router-dom'
import {Form} from 'react-bootstrap'

function Login() {

  const {register,handleSubmit,formState : {errors}} = useForm()

  let {userObj,isError,isLoading,isSuccess, errMsg} = useSelector(state => state.user)

  //get navigate function to navigate Programaticaly
  let navigate = useNavigate()

  //get dispatch function to call action creater functions
  let dispatch = useDispatch();

  const onFormSubmit = (userCredObj) => {
    if(userCredObj.userType === "user") {
      dispatch(userLogin(userCredObj));
    }

    if(userCredObj.userType === "admin") {
      alert("Admin development in progress....")
    }
      //dispatch(userLogin(userCredObj))
      //console.log(userCredObj)
  }

  //  //this to be executed when either isSuccess or isError changed
   useEffect(() => {
    if (isSuccess) {
      navigate("/userdashboard");
    }
  }, [isSuccess, isError]);
  
  return (
    <div>
      <p className='display-4 text-info text-center'>Login</p>
      <form  className='w-50 mx-auto' onSubmit={handleSubmit(onFormSubmit)} >

            <Form.Group className="mb-3">
              <Form.Label>Select type of User</Form.Label> <br />
              {/* user type */}
              <Form.Check inline type="radio" id="user">
                <Form.Check.Input
                  type="radio"
                  value="user"
                  {...register("userType", { required: true })}
                />
                
                <Form.Check.Label>User</Form.Check.Label>
              </Form.Check>
              <Form.Check inline type="radio" id="admin">
                <Form.Check.Input
                  type="radio"
                  value="admin"
                  {...register("userType", { required: true })}
                />
                <Form.Check.Label>Admin</Form.Check.Label>
              </Form.Check>
              {errors.userType && <p className = "text-danger">Select one </p>}
            </Form.Group>


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


        {/* Submit button */}
        <div className="mt-5">
          <button type="submit" className='btn btn-success d-block mx-auto'>Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login