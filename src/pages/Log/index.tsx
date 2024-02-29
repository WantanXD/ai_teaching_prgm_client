import React, { useState, useEffect } from 'react';
import NextLink from "next/link";
import { Button } from '@mui/material/';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js'
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { apiClient } from '@/lib/apiClient';

const initGraphData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: "Langs",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD', '#FF9800'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD', '#FF9800'],
      borderWidth: 3,
    },
  ],
  options: {
    maintainAspectRatio: false,
  }
};

Chart.register(ArcElement);

function Log() {

  const [loginStat, setLoginStat] = useState<boolean>(false);
  const [loginUser, setLoginUser] = useState<String|null>();
  const [loginUserId, setLoginUserId] = useState<number|null>();
  const [circleGraphData, setCircleGraphData] = useState(initGraphData);
  const [tofGraphData, setTofGraphData] = useState();

  let langRate:any = null;
  const programmingLangs: { [key : string] : string } = {
    'Java' : 'java',
    'C++' : 'c++',
    'JavaScript' : 'javascript',
    'その他': 'others'
  };
  const findKeyByValue = (obj: { [key : string] : string }, value: string): any => {
    const entry = Object.entries(obj).find(([key, val]) => val === value);
    return entry ? entry[0] : value;
  }

  const colorPalette = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD', '#FF9800'];
  const getColorFromPalette = (index: number): string => {
    const colorIndex = index % colorPalette.length;
    return colorPalette[colorIndex];
  }

  const makeCircleGraphData = async() => {
    await apiClient.post('db/getLangRate', {
      userId: loginUserId
    }).then((response:any) => {
      langRate = response.data.langRate;
    });

    return langRate;
  }

  useEffect(() => {
    const getLoginStatus = () => {
      const nowLoginStat = localStorage.getItem('loginUser') !== null ? true : false;
      setLoginStat(nowLoginStat);
      if (nowLoginStat === true) {
        setLoginUser(localStorage.getItem('loginUser'));
        setLoginUserId(Number(localStorage.getItem('loginUserId')));
      }
    }
    getLoginStatus();
    console.log(loginStat);
  }, []);

  useEffect(() => {
    if (loginUserId !== null) {
      makeCircleGraphData().then((rawData: any) => {
        const langsMap : Record<string, number> = {};
        rawData.forEach((element:any) => {
          langsMap[element.lang] = element._count.userId;
        });
        const sortedLangsArray = Object.entries(langsMap).sort((a, b) => b[1] - a[1]);
        const othersTotalValue = sortedLangsArray.slice(5).reduce((acc, [, value]) => acc + (value || 0), 0);
        const labels = sortedLangsArray.slice(0, 5).map(([key]) => key);
        console.log(sortedLangsArray);
        console.log(othersTotalValue);
        setCircleGraphData({
          labels: sortedLangsArray.length > 5 ? labels.concat(['others']) : labels,
          datasets: [
            {
              label: "Langs",
              data: sortedLangsArray.slice(0, 5).map(([, value]) => value).concat(othersTotalValue),
              backgroundColor: colorPalette,
              hoverBackgroundColor: colorPalette,
              borderWidth: 3,
            }
          ],
          options: {
            maintainAspectRatio: false,
          }
        })
      })
    }
    console.log(circleGraphData);
  }, [loginUserId])

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
                {loginUser !== null && loginUser !== '' && (
                    <React.Fragment>
                      {loginUser}さんのデータ
                    </React.Fragment>
                  )
                }
              </div>
              <div className='LogLangBody-Corner'>
                <div className='LogLangBody'>
                  {loginUser !== null && loginUser !== '' && (
                    <React.Fragment>
                      <div className='LogSubTitle'>
                        解答数ランキング
                      </div>
                    {circleGraphData !== null && (
                      <div className='logCircle'>
                        <React.Fragment>
                          <Pie data={circleGraphData}/>
                        </React.Fragment>
                      </div>
                    )}
                    {circleGraphData !== null && (
                      <div className='logCircleLabels'>
                        {circleGraphData.labels.map((label, index) => (
                          <React.Fragment key={index}>
                            <div className='label'>
                              <div 
                              key={index}
                              className='labelSquare'
                              style={{ backgroundColor: circleGraphData.datasets[0].backgroundColor[index] }}
                              />
                              <div
                              key={index}
                              className='labelTitle'
                              >
                                {findKeyByValue(programmingLangs, label)}
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className='LogTofBody-Corner'>
                <div className='LogTofBody'>
                  {tofGraphData !== null && (
                    <React.Fragment>
                      <div className='LogSubTitle'>
                        正答数比率
                      </div>
                    </React.Fragment>
                  )}
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