import React, { useState, useEffect } from 'react'
import NextLink from "next/link";
import { Button } from '@mui/material';
import { apiClient } from '@/lib/apiClient';

function Header() {

  const [loginUserName, setLoginUserName] = useState<string|null>(null);

  useEffect(() => {
    const init = async() => {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        await apiClient.post('/jwt/tokenVerification', {
          jwtToken,
        }).then((response:any)=> {
          if (response.data.isAuthenticated === true) {
            setLoginUserName(response.data.user.name);
          }
        });
      }
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
        <div className='loginButton'>
          {loginUserName === null ?
            <NextLink href="/Authenticate" passHref>
              <Button variant='outlined' color='inherit'>ログイン</Button>
            </NextLink>
          :
            <Button variant='outlined' color='inherit' onClick={userLogout}>ログアウト</Button>
          }
        </div>
      </header>
    </div>
  )
}

export default Header