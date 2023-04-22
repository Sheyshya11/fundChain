import React,{useEffect,useState} from 'react';
import { Route, Routes} from 'react-router-dom';
import axios from 'axios'

import { Sidebar, Navbar } from './components';
import { CampaignDetails, CreateCampaign, Home, Profile, Landing, CreateRequest, AdminPanel, RequestDetails,NotFoundPage } from './pages';
import DisplayRequests from './pages/DisplayRequests';
import { useStateContext } from './context';

const App = () => {
 const {address}=useStateContext();
 const [data, setData] = useState(null);


/*  const fetchData=async()=>{
 await axios.get('http://localhost:8080/api').then(
  (res)=>{setData(res.data)}
 )

 }
 useEffect(()=>{
  fetchData();
 },[])
 */

  return (
    <div className="relative  sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
  
       
      
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>
      <div className="flex-1  max-sm:w-full max-w-[1380px] mx-auto sm:pr-5 ">
        <Navbar />
     
        <Routes>
          <Route  path="/" element={<Landing />} />
          <Route  path="/dashboard" element={<Home />}/>
          <Route  path="/profile" element={<Profile />} />
          <Route  path="/create-campaign" element={address ? <CreateCampaign />: <NotFoundPage/>} />
          <Route  path="/create-request/:id" element={<CreateRequest />}/>
          <Route  path="/view-request/:id" element={ <DisplayRequests />}/>
          <Route  path='/request-details/:id' element={<RequestDetails />}/>
          <Route  path="/admin-panel" element={address == '0xA2ADF0362490B7de632907AbA251c98DDC9F4222' ? <AdminPanel /> : <NotFoundPage/>}/>
          <Route  path="/campaign-details/:name/:id" element={<CampaignDetails />} />
          <Route  path='*' element={<NotFoundPage/>} />
          <Route  path='/notFound' element={<NotFoundPage/>} />
        </Routes>
       
      </div>
    </div>
  )
}

export default App