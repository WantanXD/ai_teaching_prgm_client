import { apiClient } from '@/lib/apiClient';
import React from 'react'
import {useRef} from "react"
import Header from "@/components/Header";

function Authenticate() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleRegisterSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    await apiClient.post("/auth/register",{
      name, 
      email, 
      pass:password,
    }).then((response:any)=>{
      localStorage.setItem('loginUser', response.data.name);
      localStorage.setItem('loginEmail', response.data.email);
      
    })
  }

  const handleLoginSubmit = async(e:React.FormEvent<HTMLFormElement>) => {

  }

  return (
    <div className="h-screen">
      <div className="Header">
        <Header/>
      </div>
      authenticate
      <form onSubmit={handleRegisterSubmit}>
        <input type="text" name="name" placeholder='名前を入力' ref={nameRef}/>
        <input type="text" name="email" placeholder='メルアド' ref={emailRef}/>
        <input type="text" name="pass" placeholder='ぱすわ' ref={passwordRef}/>
        <input type="submit" value="登録"/>
      </form>
      login
      <div>
    </div>
    </div>
  )
}

export default Authenticate