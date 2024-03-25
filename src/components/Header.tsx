import React from 'react'
import NextLink from "next/link";
import { Button } from '@mui/material';

function Header() {
  return (
    <div>
      <header className="Header bg-green-200">
        <div className='loginButton'>
          <NextLink href="/Authenticate" passHref>
            <Button className='loginButton' variant='outlined' color='inherit'>ログイン</Button>
          </NextLink>
        </div>
      </header>
    </div>
  )
}

export default Header