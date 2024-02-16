import { apiClient } from '@/lib/apiClient';
import React from 'react'
import {useRef} from "react"
import Header from "@/components/Header";

function Authenticate() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    await apiClient.post("/auth/register",{
      name, 
      email, 
      pass:password,
    }).then((response:any)=>{
      console.log(response.data)
    })

  }
  return (
    <div className="h-screen">
<<<<<<< HEAD
      <div className="Header">
=======
      <div>
>>>>>>> cb52464ceaa78c3ffe5ef52655ff6cc60d2d88a0
        <Header/>
      </div>
      authenticate
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder='名前を入力' ref={nameRef}/>
        <input type="text" name="email" placeholder='メルアド' ref={emailRef}/>
        <input type="text" name="pass" placeholder='ぱすわ' ref={passwordRef}/>
        <input type="submit" value="送信"/>
      </form>
    </div>
  )
}

export default Authenticate