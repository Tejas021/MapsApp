
import './App.css';
import {useEffect, useState} from "react"
import Login from './components/Login';
import Register from './components/Register';
import RoomIcon from '@material-ui/icons/Room';
import StarIcon from '@material-ui/icons/Star';
import ReactMapGL, {Marker,Popup}from 'react-map-gl';
import {format} from "timeago.js"

import axios from "axios"


function App() {

  const [pins,setPins]=useState([])
  const [username, setUsername] = useState(localStorage.getItem("user"))
  const [newPlace, setNewPlace] = useState(null)
 const [showLogin,setshowLogin] =useState(false)
 const [showRegister,setShowRegister] =useState(false)
  const [newPin, setnewPin] = useState({title:"",desc:"",rating:0})
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  useEffect(() => {
const getPins=async()=>{

 await axios.get("http://localhost:5000/api/pins").then(res=>{setPins(res.data);setViewport({...viewport,latitude:res.data[0].lat,longitude:res.data[0].long})})
 
}
getPins()
   
  }, [])

  const handleAddNewPlace=async(e)=>{
    // e.preventDefault()
    // setUsername("Tejas Kolwankar")
    console.log(e.lngLat)
    const [long,lat]=e.lngLat
    console.log(long,lat)
    setNewPlace({lat:lat,long:long})
    // console.log({username:username,lat:lat,long:long,title:newPin.title,rating:newPin.rating,desc:newPin.desc})
    // await axios.post("http://localhost:5000/pins",{username,lat:lat,long:long,title:newPin.title,rating:newPin.rating,desc:newPin.desc})
  }

  const handleRoomClick=(id,lat,long)=>{
    setCurrentPlaceId(id)
    setViewport({...viewport,latitude: lat,
      longitude: long,})

  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
   await axios.post("http://localhost:5000/api/pins",{username:username,lat:newPlace.lat,long:newPlace.long,title:newPin.title,rating:newPin.rating,desc:newPin.desc}).then(res=>setPins([...pins,res.data]))
   setNewPlace(null)

  }

  return (
    <div className="App">
      <header className="App-header">
     
       <ReactMapGL
       onDblClick={(e)=>handleAddNewPlace(e)}
      {...viewport}
      mapboxApiAccessToken="pk.eyJ1IjoidGVqYXMwMjEiLCJhIjoiY2t3a3Rid3k5MXZoODJvcG1ldTFrNGtwZyJ9.CoqEROg2b_2uWGNFcJAtPg"
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/tejas021/ckwlnpgt31ecd14o5kn0qqskm"
      transitionDuration={1000}
    >
      {pins.map(p=><><Marker onClick={e=>handleRoomClick(p._id,p.lat,p.long)} latitude={p.lat} longitude={p.long} offsetLeft={-20} offsetTop={-10}>
           <RoomIcon style={{cursor:"pointer",color:(username===p.username)?"tomato":"slateblue"}}/>
         </Marker>

         {p._id===currentPlaceId&& <Popup
                 latitude={p.lat}
                 longitude={p.long}
                 closeButton={true}
                 closeOnClick={false}
                onClose={()=>setCurrentPlaceId(null)}
                 anchor="left" >
                   <div className="card">
                   <label>Title</label>
                   <h4 className='place'>{p.title}</h4>
                   <label>Review</label>
                   <p>{p.desc}</p>
                   <label>Rating</label>
                   <div className="stars">
                     {Array(p.rating).fill(<StarIcon className="star"/>)}
                   
                  
                   </div>
                   <label className="descs">Information</label>
                   <span className='desc'>Created By <b>{p.username}</b></span>
                   <span className="desc">{format(p.createdAt)}</span>
                   </div></Popup>}
        
         </>)}
  
      {newPlace&& <Popup
                 latitude={newPlace.lat}
                 longitude={newPlace.long}
                 closeButton={true}
                 closeOnClick={false}
                 
                onClose={()=>setNewPlace(null)}
                 anchor="left" >
                   <div className="card">{username? <form onSubmit={e=>handleSubmit(e)}>
                   <label>Title</label>
                   <input onChange={e=>setnewPin({...newPin,title:e.target.value})}></input>
                   <label>Review</label>
                   <textarea  onChange={e=>setnewPin({...newPin,desc:e.target.value})}/>
                   <label>Rating</label>
                   <select onChange={e=>setnewPin({...newPin,rating:e.target.value})}>
                  
                   <option value={1}>1</option>
                   <option value={2}>2</option>
                   <option value={3}>3</option>
                   <option value={4}>4</option>
                     <option value={5}>5</option>
                   </select>
                   <button className="addPinButton">Add Pin</button>
                 </form>:<h3 style={{textAlign:"center",color:"darkred"}}>Login or Register To Add pins to the map</h3>}
                
                   </div></Popup>}
        
         
     
           
    
      {!username?    <div className='buttons'>  <button className='button login' onClick={()=>{setshowLogin(true);setShowRegister(false)}}>Login</button>
      <button className='button signup' onClick={()=>{setshowLogin(false);setShowRegister(true)}}>Sign up</button></div>:(  <button className='button logout' onClick={()=>{localStorage.removeItem("user");setUsername(null)}}>Logout</button>)}
    
{showRegister&&<Register setShowRegister={setShowRegister} setUsername={setUsername}/>}
{showLogin&&<Login setshowLogin={setshowLogin}  setUsername={setUsername}/>}
  </ReactMapGL>
    
      </header>
    </div>
  );
}

export default App;
