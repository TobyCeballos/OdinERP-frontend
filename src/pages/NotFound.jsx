import React from 'react'
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
  return (
    <div onClick={() => navigate("/")} className='cursor-pointer fixed top-0 left-0 z-50 w-full h-full flex  flex-col items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm'><span className='text-9xl font-bold'>404</span><span className='text-xl uppercase'>Not Found</span> <span className='absolute text-md bottom-7'>(vuelva atras con un click)</span></div>
  )
}

export default NotFound