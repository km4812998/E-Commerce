import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {
  const [state,setState]=useState("Login");
  const [formData,setFormData] = useState({
    username:"",
    email:"",
    password:""
  });

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const login=async()=>{
    console.log("Login Function Executed",formData);
    let responseData;
    await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{
        Accept: 'application/form-data',
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responseData=data)
    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors);
    }
  }
  const signup=async()=>{
    console.log("Signup Function Executed",formData);
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method:'POST',
      headers:{
        Accept: 'application/form-data',
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responseData=data)
    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors);
    }
  }
  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign Up"?<input name='username' value={formData.username} onChange={handleChange} type="text" placeholder='Enter Your Name' />:<></>}
          <input name='email' value={formData.email} onChange={handleChange} type="email" placeholder='Enter Your Email' />
          <input name='password' value={formData.password} onChange={handleChange} type="password" placeholder='Enter Your Password' />
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Sign Up"?<p className="loginsignup-login">
          Already have an Account? <span onClick={()=>{setState("Login")}}>Login here</span>
        </p>:<p className="loginsignup-login">
          Create an Account? <span onClick={()=>{setState("Sign Up")}}>Register here</span>
        </p>}
        <div className="loginsignup-agree">
          <input className='check' type="checkbox" name='' id='' />
          <p>By Continuing, I Agree To The Terms Of Use & Privacy Policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup