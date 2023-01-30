import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation, useLinkClickHandler } from 'react-router-dom';

import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search, icon, logo2 } from '../assets';
import { navlinks } from '../constants';


const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address } = useStateContext();
  const { pathname } = useLocation();


  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className="lg:flex-1 flex flex-row max-w-[300px] py-2 pl-4 pr-2 h-[52px]  rounded-[100zpx]">
        {pathname === '/' ? <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-green-400 mr-[20px]">FUNDCHAIN</h1> : ''}

        {pathname === '/' ? '' : (<React.Fragment><input type="text" placeholder="Search for campaigns" className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none" />

          <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
            <img src={search} alt="search" className="w-[15px] h-[15px] object-contain" />
          </div></React.Fragment>)}



      </div>


      {pathname === '/' ? '' : <div className="sm:flex hidden flex-row justify-end gap-4 ">
      <CustomButton
          btnType="button"
          title={address ? 'Create a campaign' : 'Connect'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
          handleClick={() => {
            if (address) navigate('create-campaign')
            else connect()
          }}
        />
          




        <Link to="/home">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img src={icon} alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>
        </Link>

      </div>
      }

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[60px] h-[50px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img src={logo2} alt="user" className="w-[60%] h-[60%] object-contain" />
        </div>

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
                  connect();
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