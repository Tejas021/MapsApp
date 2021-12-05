import React,{useState} from 'react'
import axios from "axios";
import "./auth.css"
import RoomIcon from '@material-ui/icons/Room';
const Login = ({setshowLogin,setUsername}) => {

    const [userDetails, setUserDetails] = useState({username:"",password:""})
    const [error, seterror] = useState(false)
    const [success, setsuccess] = useState(false)
    const handleUserDetails=(e)=>{
        e.preventDefault()
        setUserDetails({...userDetails,[e.target.name]:e.target.value})
      
        

    }
    const submitLogin=async(e)=>{
        e.preventDefault()
        try{
            const user=await axios.post("http://localhost:5000/api/users/login",userDetails)
            localStorage.setItem("user",user.data.username)
            setUsername(user.data.username)
            setsuccess(true)
            seterror(false)
            setshowLogin(false)
         
        }
        catch(err){
            seterror(true)
            setsuccess(false)
            
        }
    
    
        
    }
    return (
        <div className="form-body">
                <div className='logo'><RoomIcon/>TEJPIN</div>
                <h4 className="r-title">Login</h4>
            <form onSubmit={e=>submitLogin(e)}>
            <input className="" placeholder="username" onChange={e=>handleUserDetails(e)} name="username"></input>
        
            <input className="" placeholder="password" type="password" onChange={e=>handleUserDetails(e)} name="password"></input>
            <button className="auth button">Login</button>
            {success&&<div className="success">Login successful</div>}
            {error&&<div className="error">There was a problem, try again!</div>}
            </form>
            <div className='cancel' onClick={()=>setshowLogin(false)}>x</div>
        </div>
    )
}

export default Login
