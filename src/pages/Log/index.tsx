import React, { useState, useEffect } from 'react';
import NextLink from "next/link";
import { Button } from '@mui/material/';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { apiClient } from '@/lib/apiClient';

const initCircleGraphData = {
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

const initBarLabels = ['Red', 'Blue', 'Green', 'Yellow'];
const initBarGraphData = {
  labels: initBarLabels,
  datasets: [
    {
      label: 'True',
      data: initBarLabels.map(() => 60.0),
      backgroundColor: '#4CAF50',
    },
    {
      label: 'False',
      data: initBarLabels.map(() => 40.0),
      backgroundColor: '#FFA500',
    }
  ],
}
const initBarGraphOptions = {
  indexAxis: 'y',
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
  elements: {
    bar: {
      borderWidth: 2,
    }
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
  }
};

Chart.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

function Log() {

  const [loginStat, setLoginStat] = useState<boolean>(false);
  const [loginUser, setLoginUser] = useState<String|null>();
  const [loginUserId, setLoginUserId] = useState<number|null>();
  const [circleGraphData, setCircleGraphData] = useState(initCircleGraphData);
  const [barGraphData, setBarGraphData] = useState(initBarGraphData);
  const [historyData, setHistoryData] = useState(null);
  const [langPercentage, setLangPercentage] = useState<number>(-1);

  let langRate:any = null;
  let trueRate:any = null;
  const programmingLangs: { [key : string] : string } = {
    'Java' : 'java',
    'C言語' : 'c',
    'C++' : 'c++',
    'JavaScript' : 'javascript',
    'Python' : 'python',
    'Go' : 'go',
    'C#' : 'cs',
    'Ruby' : 'rb',
    'SQL' : 'sql',
    'PHP' : 'php',
    'ShellScript' : 'sh',
    'その他': 'others'
  };

  const colorPalette = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD', '#FF9800'];
  const otherColor = '#D3D3D3';
  const getColorFromPalette = (index: number): string => {
    const colorIndex = index % colorPalette.length;
    return colorPalette[colorIndex];
  }

  const cvrtLangName = (e:any) => {
    const cvrtLangData = e.map((item:any) => {
      const langName = Object.keys(programmingLangs).find((key:string) => programmingLangs[key] === item.lang);
      return {
        _count: item._count,
        lang: langName || item.lang,
      }
    });
    return cvrtLangData;
  };

  const makeCircleGraphData = async() => {
    await apiClient.post('db/getLangRate', {
      userId: loginUserId
    }).then((response:any) => {
      langRate = cvrtLangName(response.data.returnData);
    });

    return langRate;
  };
  const makeBarGraphData = async() => {
    await apiClient.post('db/getTofRate', {
      userId: loginUserId,
    }).then((response:any) => {
      trueRate = cvrtLangName(response.data.returnData);
    });

    return trueRate;
  };
  const makeHistoryData = async() => {
    await apiClient.post('db/getHistory', {
      userId: loginUserId,
    }).then((responce:any) => {
      
    });
  }

  useEffect(() => {
    console.log(langPercentage);
  }, [langPercentage])

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
        setLangPercentage(Object.values(sortedLangsArray).reduce((acc, [, value]) => acc + value, 0));
        console.log(sortedLangsArray);
        console.log(othersTotalValue);
        setCircleGraphData({
          labels: sortedLangsArray.length > 5 ? labels.concat(['others']) : labels,
          datasets: [
            {
              label: "解答数",
              data: sortedLangsArray.slice(0, 5).map(([, value]) => value).concat(othersTotalValue),
              backgroundColor: sortedLangsArray.length > 5 ? colorPalette.slice(0, 5).concat([otherColor]) : colorPalette,
              hoverBackgroundColor: sortedLangsArray.length > 5 ? colorPalette.slice(0, 5).concat([otherColor]) : colorPalette,
              borderWidth: 3,
            }
          ],
          options: {
            maintainAspectRatio: false,
          }
        })
      })

      makeBarGraphData().then((rawData: any) => {
        const langsMap : Record<string, number> = {};
        rawData.forEach((element:any) => {
          langsMap[element.lang] = Math.round(element._count.tof / element._count.userId * 10000) / 100;
        });
        const sortedLangsArray = Object.entries(langsMap).sort((a, b) => b[1] - a[1]);
        setBarGraphData({
          labels: sortedLangsArray.slice(0, 5).map(([key]) => key),
          datasets: [
            {
              label: '正答',
              data: sortedLangsArray.slice(0, 5).map(([, value]) => value),
              backgroundColor: '#4CAF50',
            },
            {
              label: '不正答',
              data: sortedLangsArray.slice(0, 5).map(([, value]) => 100 - value),
              backgroundColor: '#FFA500',
            },
          ],
        })
      });


    };
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
                        解答数比較
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
                          <React.Fragment key={"circle" + index}>
                            <div className='label'>
                              <div 
                              key={"labelSquare" + index}
                              className='labelSquare'
                              style={{ backgroundColor: circleGraphData.datasets[0].backgroundColor[index] }}
                              />
                              <div
                              key={"labelTitle" + index}
                              className='labelTitle'
                              >
                                {langPercentage !== -1 && langPercentage !== 0 && (
                                  <React.Fragment>
                                    {(Math.round(circleGraphData.datasets[0].data[index] / langPercentage * 10000) / 100) < 100 ?
                                      (Math.round(circleGraphData.datasets[0].data[index] / langPercentage * 10000) / 100) < 10 ? 
                                      (Math.round(circleGraphData.datasets[0].data[index] / langPercentage * 10000) / 100).toFixed(2)
                                    : (Math.round(circleGraphData.datasets[0].data[index] / langPercentage * 10000) / 100).toFixed(1)
                                    : (Math.round(circleGraphData.datasets[0].data[index] / langPercentage * 10000) / 100)
                                    }%:<b>{label}</b>
                                  </React.Fragment>
                                )}
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
                  {loginUser !== null && loginUser !== '' && (
                    <React.Fragment>
                      <div className='LogSubTitle'>
                        正答率比較
                      </div>
                      {barGraphData !== null && (
                        <div className='logBar'>
                          <React.Fragment>
                            <Bar options={initBarGraphOptions} data={barGraphData}/>
                          </React.Fragment>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className='logDataBody-Corner'>
                <div className='logDataBody'>
                  {loginUser !== null && loginUser !== '' && (
                    <React.Fragment>
                      <div className='LogSubTitle'>
                        履歴
                      </div>
                      {historyData !== null && (
                        <div className='LogHistoryData'>
                          {

                          }
                        </div>
                      )}
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