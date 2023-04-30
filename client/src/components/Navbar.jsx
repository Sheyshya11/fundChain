import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation, useLinkClickHandler } from 'react-router-dom';

import { useStateContext } from '../context';
import { CustomButton } from '../components';
import { logo, menu, search, icon, logo2 } from '../assets';
import { navlinks } from '../constants';
import { truncate } from '../utils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address, getbalance, contract } = useStateContext();
  const [Balance,setBalance] = useState('');
  const { pathname } = useLocation();
 
  
  const getCurrentBalance=async()=>{
 const data= await getbalance();
 const balance = data.displayValue.substring(0,6)
 setBalance(balance)
  }
useEffect(()=>{
  if(address){
    getCurrentBalance();
  }
},[address,contract,Balance])

const notify = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

}



  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      
      <div className="lg:flex-1 flex flex-row max-w-[300px] py-2 pl-4 pr-2 h-[52px]  rounded-[100zpx]">
        {pathname === '/' ? <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-green-400 mr-[20px]">FUNDCHAIN</h1> : ''}

        {pathname === '/' ? '' : (<React.Fragment><input type="text" placeholder="Search for campaigns" className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none" />

          <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
            <img src={search} alt="search" className="w-[15px] h-[15px] object-contain" />
          </div></React.Fragment>)}



      </div>
      <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}        
          theme="light"
        />
      {pathname === '/' ? '' : <div className="sm:flex hidden flex-row justify-end gap-4 items-center ">
        {address ? <CustomButton
          btnType="button"
          title={truncate(address, 4, 4, 11)}
          styles='bg-[#7024ec] rounded-[5px]' //8c6dfd
          handleClick={() => {
            navigate('/dashboard')

          }}
        /> : ''}
         {address ? <div className='font-epilogue flex justify-center items-center font-semibold text-[16px]  bg-[#9F2B68] leading-[26px] text-white min-h-[52px] px-4 rounded-[5px] '>
          <p className="flex">{Balance} ETH</p>
        </div> : ''}

          {address != '0xA2ADF0362490B7de632907AbA251c98DDC9F4222' ?
          <CustomButton
          btnType="button"
          title={address ? 'Create a campaign' : 'Connect'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#7024ec]'}
          handleClick={() => {
            if (address) navigate('create-campaign')
            else{
          
              connect();
              notify('Login with metamask')
            }
          }}
        /> :
        <CustomButton
          btnType="button"
          title={address ? 'Admin Dashboard' : 'Connect'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#7024ec]'}
          handleClick={() => {
            if (address) navigate('admin-panel')
            else{
              connect();
              notify('Login with metamask')
            }
          }}
        />
          }
        {/* <CustomButton
          btnType="button"
          title={address ? 'Create a campaign' : 'Connect'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#7024ec]'}
          handleClick={() => {
            if (address) navigate('create-campaign')
            else{
              connect();
            }
          }}
        />  */}
     
        

        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img src={icon} alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>
        </Link>

      </div>
      }

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <Link to='/'>
          <div className="w-[60px] h-[50px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img src={logo2} alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>
        </Link>
        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                />
                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                  {link.name}
                </p>
              </li>
            ))}
          </ul>


          <div className="flex mx-4">


            <CustomButton
              btnType="button"
              title={address ? 'Create a campaign' : 'Connect'}
              styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
              handleClick={() => {
                if (address) {
                  navigate('create-campaign')
                }
                else {
                  connect()
                
                }
              }}
            />
  


          </div>
      


        </div>
      </div>
    </div>
  )
}

export default Navbar