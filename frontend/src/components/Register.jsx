import React,{useState} from 'react'
import RoomIcon from '@material-ui/icons/Room';
import axios from "axios"
const Register = ({setShowRegister,setUsername}) => {
    const [userDetails, setUserDetails] = useState({username:"",email:"",password:""})
const [error, seterror] = useState(false)
const [success, setsuccess] = useState(false)
    const handleUserDetails=(e)=>{
        e.preventDefault()
        setUserDetails({...userDetails,[e.target.name]:e.target.value})


    }

    const submitRegister=async(e)=>{
        e.preventDefault()
        try{

            const user=await axios.post("http://localhost:5000/api/users/register",userDetails)
            localStorage.setItem("user",user.data)
            setsuccess(true)
            seterror(false)
        }
        catch(err){
            seterror(true)
            setsuccess(false)
        }
     

    }
    return (
        <div className='form-body'>
              <div className='logo'><RoomIcon/>TEJPIN</div>
              <h4 className="r-title">Register</h4>
            <form onSubmit={e=>submitRegister(e)}>
            <input className="" placeholder="username" onChange={e=>handleUserDetails(e)} name="username"></input>
            <input className="" placeholder="email" type="email" onChange={e=>handleUserDetails(e)} name="email"></input>
            <input className="" placeholder="password" type="password" onChange={e=>handleUserDetails(e)} name="password"></input>
            <button className='button auth'>Register</button>
            {success&&<div className='success'>Registration successful</div>}
            {error&&<div className='error'>There was a problem, try again!</div>}
            </form>
  <div className='cancel' onClick={()=>setShowRegister(false)}>X</div>
            
        </div>
    )
}

export default Register
