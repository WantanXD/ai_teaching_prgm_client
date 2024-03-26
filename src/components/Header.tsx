'use client'

import React, { useState, useEffect } from 'react'
import NextLink from "next/link";
import { Button } from '@mui/material';
import { apiClient } from '@/lib/apiClient';
import { authCheck } from '@/utils/authCheck';

function Header() {

  const [loginUserName, setLoginUserName] = useState<string|null>(null);

  useEffect(() => {
    const init = async() => {
      await authCheck().then((response:any) => {
        if (Object.keys(response).length !== 0) {
          console.log(response);
          setLoginUserName(response.data.user.name);
        }
      });
    }
    init();
  }, []);

  const userLogout = async() => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('jwtToken');
    setLoginUserName(null);
  }

  return (
    <div>
      <header className="Header bg-green-200">
        {loginUserName === null ?
          <div className='accountInfo'>
            <div className='loginButton'>
              <NextLink href="/Authenticate" passHref>
                <Button variant='outlined' color='inherit'>ログイン</Button>
              </NextLink>
            </div>
          </div>
          :
          <div className='accountInfo'>
            <div className='loginUser'>
              ログイン中:{loginUserName}
            </div>
            <div className='loginButton'>
              <Button variant='outlined' color='inherit' onClick={userLogout}>ログアウト</Button>
            </div>
          </div>
        }
      </header>
    </div>
  )
}

export default Header