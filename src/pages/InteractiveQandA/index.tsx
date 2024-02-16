import React, {Fragment, useState} from 'react'
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StartButton from "./StartButton";

// 最初に選択画面 & ボタンを配置
// 初期画面で、出題言語を選択し、問題出題&解答ボタンを押して開始

function interactiveQandA() {

  const [monitorState,setMonitorState] = useState("MENU");

  return (
    <main className='interactiveQandA h-screen'>
      <div className="Header">
        <Header/>
      </div>
      <div className="MainContainer h-full flex">
        <Sidebar/>
        <div className='MyBody'>
          {
          monitorState === "MENU" ? // 言語の選択とかをするページ
          <StartButton/>
          :
          
          ;
          }
        </div>
      </div>
    </main>
  )
}

export default interactiveQandA
