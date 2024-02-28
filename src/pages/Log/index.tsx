import React, { useState, useEffect } from 'react';
import NextLink from "next/link";
import { Button } from '@mui/material/';
import { Doughnut } from 'react-chartjs-2';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

function Log() {

  const [loginStat, setLoginStat] = useState<boolean>(false);
  const [loginUser, setLoginUser] = useState<String|null>();

  const colorPalette = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD', '#FF9800'];
  const getColorFromPalette = (index: number): string => {
    const colorIndex = index % colorPalette.length;
    return colorPalette[colorIndex];
  }

  useEffect(() => {
    const getLoginStatus = () => {
      const nowLoginStat = localStorage.getItem('loginUser') !== null ? true : false;
      setLoginStat(nowLoginStat);
      if (loginStat === true) {
        setLoginUser(localStorage.getItem('loginUser'));
      }
    }
    getLoginStatus();
    console.log(loginStat);
  }, []);

  return (
    <div className='log h-screen'>
      <div className="Header">
        <Header/>
      </div>
      <div className="MainContainer h-full flex">
        <Sidebar/>
        <div className='MyBody'>
          {
            loginStat === false ? 
              <NextLink href='../Authenticate' passHref>
                <Button className='LoginSuggestButton' variant='contained' size='medium'>
                  ログイン・ユーザ登録
                </Button>
              </NextLink>
            :
            <div className='LogBody'>
              <div className='LogTitle'>
                {
                  loginUser !== null && (
                    <React.Fragment>
                      {loginUser}さんのデータ
                    </React.Fragment>
                  ) 
                }
              </div>
              <div className='LogLangBody-Corner'>
                <div className='LogLangBody'>
                  あ
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Log;