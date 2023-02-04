import React, { useState } from 'react';
import {
   FacebookShareButton, TwitterShareButton,FacebookIcon, RedditShareButton, RedditIcon, TwitterIcon
  } from 'react-share';

const ShareCampaign = () => {

  return (
    <div className='flex flex-col gap-4 mt-4'>
     
          
     <div className='flex flex-row justify-around items-center'>
      <FacebookShareButton className=" font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]" url={window.location.href} >
      <FacebookIcon className="flex" size={32} round={true} />
      </FacebookShareButton>
      <TwitterShareButton className=" font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]" url={window.location.href} >
      <TwitterIcon className="flex" size={32} round={true} />
      </TwitterShareButton>
      <RedditShareButton className=" font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]" url={window.location.href} >
      <RedditIcon className="flex" size={32} round={true} />
      </RedditShareButton>
      </div>
    </div>
  );
};

export default ShareCampaign;


