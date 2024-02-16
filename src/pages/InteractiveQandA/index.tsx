import React from 'react'
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

function interactiveQandA() {

  return (
    <div className='interactiveQandA h-screen'>
      <div className="Header">
        <Header/>
      </div>
      <div className="MainContainer h-full flex">
        <Sidebar/>
        <div className='MyBody'>
          
        </div>
      </div>
    </div>
  )
}

export default interactiveQandA;
