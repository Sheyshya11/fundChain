import React from 'react';
import { useNavigate } from 'react-router-dom';
import { transparency, secured, decen, crowdfund, vote } from '../assets';
import { CustomButton } from '../components';
import { Footer } from '../components'


const Landing = () => {

   const navigate = useNavigate();

   return (
      /* Landing Hero Section */
      <>
         <div className='flex flex-col gap-4'>
            <div className=' flex flex-col relative justify-center items-center'>
               <img className='w-full h-[58vh]  object-cover rounded-[15px] mx-auto ' src={crowdfund} /> {/* https://nairametrics.com/wp-content/uploads/2020/06/bitcoin.jpg?w=900 */}

               <CustomButton
                  btnType="button"
                  title={'Get Started'}
                  styles={'bg-green-500 sm:w-[300px] w-[200px] absolute bottom-[20px]'}
                  handleClick={() => {
                     navigate('dashboard')

                  }} />

            </div>

            <div className='flex sm:flex-row flex-col justify-around  sm:items-end items-center  py-[62px]  '>
               <div className='flex-col'>
                  <img className='w-[64px] md:h-[64px]   object-cover rounded-[15px] mx-auto ' src={transparency}></img>
                  <div className="px-6 py-4">
                     <div className="font-bold text-xl mb-2 text-gray-600">TRANSPARENCY</div>
                  </div>
               </div>
               <div className='flex-col'>
                  <img className='w-[64px] h-[64px]  object-cover rounded-[15px] mx-auto ' src={secured}></img>
                  <div className="px-6 py-4">
                     <div className="font-bold text-xl mb-2 text-gray-600">SECURITY</div>
                  </div>
               </div>
               <div className='flex-col'>
                  <img className='w-[94px] h-[94px]  object-cover rounded-[15px] mx-auto bg-blue-300 ' src={decen}></img>
                  <div className="px-6 py-4">
                     <div className="font-bold text-xl mb-2 text-gray-600">DECENTRALIZATION</div>
                  </div>
               </div>
               <div className='flex-col'>
                  <img className='w-[84px] h-[84px]  object-cover rounded-[15px] mx-auto ' src={vote}></img>
                  <div className="px-6 py-4">
                     <div className="font-bold text-xl mb-2 text-gray-600">CONTROL</div>
                  </div>
               </div>
            </div>
            <div className="flex flex-col">
               <h1 className="font-epilogue text-white text-[40px] font-bold text-green-400 ">ABOUT FUNDCHAIN</h1>
               <div className='mb-[60px]'>

                  <p className="mb-3 text-[16px] first-line:font-light text-gray-500 dark:text-gray-400  first-line:tracking-widest first-letter:text-7xl first-letter:font-bold first-letter:text-gray-900 dark:first-letter:text-gray-100 first-letter:mr-3 first-letter:float-left">FundChain: A Secure and Transparent Crowdfunding Platform is a decentralized crowdfunding application (DApp) based on voting that will utilize blockchain technology and smart contracts to enable individuals and organizations to raise funds for specific projects or causes in a transparent, secure, and decentralized way.</p>
               </div>
            </div>

            <Footer />

         </div>
      </>)
}

export default Landing;