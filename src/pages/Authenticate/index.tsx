'use client'

import { apiClient } from '@/lib/apiClient';
import React from 'react'
import {useRef, useState} from "react"
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

function Authenticate() {
  //const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const rnameRef = useRef<HTMLInputElement>(null);
  const remailRef = useRef<HTMLInputElement>(null);
  const rpasswordRef = useRef<HTMLInputElement>(null);
  const [loginUser, setLoginUser] = useState<string|null>(null);

  const handleRegisterSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = rnameRef.current?.value;
    const email = remailRef.current?.value;
    const password = rpasswordRef.current?.value;
    await apiClient.post("/auth/register",{
      name, 
      email, 
      pass:password,
    }).then(async(response:any)=>{
      console.log(response);
      localStorage.setItem('jwtToken', response.data.jwtToken);
      const res = await apiClient.post('/jwt/tokenVerification', {
        jwtToken: localStorage.getItem('jwtToken'),
      });
      setLoginUser(response.data.user.name);
    })
  }

  const handleLoginSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    await apiClient.post("/auth/login",{
      email, 
      pass:password,
    }).then((response:any)=>{
      if (response.data.success === true) {
        setLoginUser(response.data.user.name);
        localStorage.setItem('jwtToken', response.data.jwtToken);
      }
    })
  }

  return (
    <div className="h-screen">
      <div className="Header">
        <Header/>
      </div>
      <div className='MainContainer h-full flex'>
        <Sidebar/>
        <div className='MyBody'>
          <div>
          <form onSubmit={handleLoginSubmit}>
            <input type="text" name="email" placeholder='メルアド' ref={emailRef}/>
            <input type="text" name="pass" placeholder='ぱすわ' ref={passwordRef}/>
            <input type="submit" value="ログイン"/>
          </form>
          <form onSubmit={handleRegisterSubmit}>
            <input type="text" name="name" placeholder='名前を入力' ref={rnameRef}/>
            <input type="text" name="email" placeholder='メルアド' ref={remailRef}/>
            <input type="text" name="pass" placeholder='ぱすわ' ref={rpasswordRef}/>
            <input type="submit" value="登録"/>
          </form>
          </div>
          <div>
            ログイン中のユーザ:{loginUser}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Authenticate