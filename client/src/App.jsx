import React from 'react';
import { Route, Routes} from 'react-router-dom';


import { Sidebar, Navbar } from './components';
import { CampaignDetails, CreateCampaign, Home, Profile, Landing, CreateRequest, RequestDetails, RequestProfile,NotFoundPage } from './pages';
import DisplayRequests from './pages/DisplayRequests';
import { useStateContext } from './context';

const App = () => {
 const {address}=useStateContext();
  return (
    <div className="relative bg-black sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>
      <div className="flex-1  max-sm:w-full max-w-[1280px] mx-auto sm:pr-5 ">
        <Navbar />
     
        <Routes>
          <Route  path="/" element={<Landing />} />
          <Route  path="/dashboard" element={<Home />}/>
          <Route  path="/profile" element={<Profile />} />
          <Route  path="/create-campaign" element={address ? <CreateCampaign />: <NotFoundPage/>} />
          <Route  path="/create-request/:id" element={<CreateRequest />}/>
          <Route  path="/view-request/:id" element={<DisplayRequests />}/>
          <Route  path="/viewAllRequest" element={<RequestProfile />}/>
          <Route  path='/request-details/:id' element={<RequestDetails />}/>
          <Route  path="/campaign-details/:name/:id" element={<CampaignDetails />} />
          <Route  path='*' element={<NotFoundPage/>} />
          <Route  path='/notFound' element={<NotFoundPage/>} />
        </Routes>
       
      </div>
    </div>
  )
}

export default App