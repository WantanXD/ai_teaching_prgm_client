import React, { useState, useEffect } from 'react';
import NextLink from "next/link";
import ReactMarkdown from 'react-markdown';
import { Button } from '@mui/material/';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CustomLink from '@/components/CustomLink';
import CodeBlock from '@/components/CodeBlock';
import { questionObj, authObj } from '@/utils/myObjects';
import { apiClient } from '@/lib/apiClient';
import { authCheck } from '@/utils/authCheck';

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
const initBarGraphOptions: any = {
  indexAxis: "y",
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

  const [loginUserName, setLoginUserName] = useState<String|null>(null);
  const [loginUserId, setLoginUserId] = useState<number|null>(null);
  const [circleGraphData, setCircleGraphData] = useState(initCircleGraphData);
  const [barGraphData, setBarGraphData] = useState(initBarGraphData);
  const [historyData, setHistoryData] = useState<questionObj[]>([]);
  const [langPercentage, setLangPercentage] = useState<number>(-1);
  const [isViewHistoryDetails, setIsViewHistoryDetails] = useState<boolean>(false);
  const [questionLog, setQuestionLog] = useState<questionObj|null>(null);

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

  const removeCharacters = (e:string): string => {
    e = e.replace(/^"|"$/g, '');
    const invalidChars = ['*', '問', '題', ':', '：', '\n', ' '];
    let startIndex = 0;
    for (let i = 0; i < e.length; i++) {
        if (!invalidChars.includes(e[i])) {
            startIndex = i;
            break;
        }
    }
    e = e.replace(/\"([^\"]*)\"/g, '$1');
    return e.slice(startIndex);
  }

  const cvrtLangName = (e:any) => {
    const cvrtLangData = e.map((item:any) => {
      const langName = Object.keys(programmingLangs).find((key:string) => programmingLangs[key] === item.lang);
      if ('_count' in item) {
        return {
          _count: item._count,
          lang: langName || item.lang,
        }
      }
      else {
        return {
          ...item,
          lang: langName || item.lang,
        }
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
      limit: 100,
    }).then((response:any) => {
      response.data.returnData.map((item:questionObj) => {
        item.question = removeCharacters(item.question);
      });
      setHistoryData(cvrtLangName(response.data.returnData));
    });
  }

  const changeViewHistoryDetails = () => {
    if (isViewHistoryDetails === false) {
      setIsViewHistoryDetails(true);
    }
    else {
      setIsViewHistoryDetails(false);
    }
    setQuestionLog(null);
  }

  const changeViewQuestionLog = (questionData:questionObj|null) => {
    setIsViewHistoryDetails(true);
    setQuestionLog(questionData);
  }

  useEffect(() => {
    //console.log(langPercentage);
  }, [langPercentage])

  useEffect(() => {
    const getLoginStatus = async() => {
      const response = await authCheck();
      if (response.data.isAuthenticated === true) {
        setLoginUserName(response.data.user ? response.data.user.name : null);
        setLoginUserId(response.data.user ? Number(response.data.user.id) : null);
      }
    }
    getLoginStatus();
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
        //console.log(sortedLangsArray);
        //console.log(othersTotalValue);
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
      makeHistoryData();
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
            loginUserId === null ? 
              <NextLink href='../Authenticate' passHref>
                <Button className='LoginSuggestButton' variant='outlined' size='medium'>
                  ログイン・ユーザ登録
                </Button>
              </NextLink>
            :
            <div className='LogBody'>
              <div className='LogTitle'>
                {loginUserName !== null && loginUserName !== '' && (
                    <React.Fragment>
                      {loginUserName}さんのデータ
                    </React.Fragment>
                  )
                }
              </div>
              <div className='LogLangBody-Corner'>
                <div className='LogLangBody'>
                  {loginUserName !== null && loginUserName !== '' && (
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
                  {loginUserName !== null && loginUserName !== '' && (
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
                  {loginUserName !== null && loginUserName !== '' && (
                    <React.Fragment>
                      <div className='LogSubTitle' onClick={changeViewHistoryDetails}>
                        履歴
                      </div>
                      <div className='LogHistoryData'>
                        {Array.isArray(historyData) && historyData.length !== 0 && (
                          historyData.slice(0, 5).map((row, index) => {
                            return(
                              <React.Fragment key={index}>
                                <div className='LogHistory'>
                                  <section className='tof'>
                                    {row.tof === true ? '🟢 ✔':'🟡❌'}
                                  </section>
                                  <section className='lang'>
                                    <b>{row.lang}</b>
                                  </section>
                                  <section className='ques'>
                                    <CustomLink href='' onClick={() => changeViewQuestionLog(row)} preventDefault>
                                      {row.question}
                                    </CustomLink>
                                  </section>
                                </div>
                              </React.Fragment>
                            );
                          })
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
              {isViewHistoryDetails === true && (
                <React.Fragment>
                  <div className='logCover' onClick={changeViewHistoryDetails}>
                   
                  </div>
                  {questionLog !== null ?
                    <div className='historyDetails-Corner'>
                      <div className='historyDetails'>
                        <div className='LogSubTitle'>
                          解答履歴
                        </div>
                        <div className='questionLog-ui'>
                          <div className='questionLog-Tof'>
                            {questionLog.tof === true ? 
                              <div className='tofRect'>
                                <div className='correct'>正解した問題</div>
                              </div>
                            :
                              <div className='tofRect'>
                                <div className='incorrect'>不正解だった問題</div>
                              </div>
                            }
                            <hr />
                          </div>
                          <Button className='backButton' variant='outlined' size='medium' onClick={() => changeViewQuestionLog(null)}>
                            全ての問題履歴を見る
                          </Button>
                        </div>
                        <div className='questionLog'>
                          <div className='question'>
                            <p><b>問題：</b></p>
                            {questionLog.question.split('```').map((sentence:string, index:number) => (
                              <React.Fragment key={index}>
                              {index % 2 === 0 ? 
                                <ReactMarkdown className="">{sentence}</ReactMarkdown>
                              :
                                <CodeBlock className={"language-" + programmingLangs[questionLog.lang]} children={sentence.substring(sentence.indexOf('\n')+1)}/>
                              }
                              </React.Fragment>
                            ))}
                          </div><br />
                          <div className='answer'>
                            <p><b>あなたの解答：</b></p>
                            <CodeBlock className={"language-" + programmingLangs[questionLog.lang]} children={questionLog.answer}/>
                          </div><br />
                          {questionLog.reasons !== undefined && questionLog.reasons !== null && questionLog.reasons.length !== 0 && (
                            <div className='reason'>
                              <ReactMarkdown className="bg-red-100 border-red-400 text-red-700 border rounded-md p-4 mb-4">
                                {questionLog.reasons}
                              </ReactMarkdown>
                              <br/>
                            </div>
                          )}
                          {questionLog.modelAns !== undefined && questionLog.modelAns !== null && questionLog.modelAns.length !== 0 && (
                            <div className='model-answer'>
                              {questionLog.modelAns.split('```').map((sentence:string, index:number) => (
                                <React.Fragment key={index}>
                                {index % 2 === 0 ? 
                                  <ReactMarkdown className="">{sentence}</ReactMarkdown>
                                :
                                  <CodeBlock className={"language-" + programmingLangs[questionLog.lang]} children={sentence.substring(sentence.indexOf('\n')+1)}/>
                                }
                                </React.Fragment>
                              ))}
                              <br/>
                            </div>
                          )}
                          <div className='comment'>
                            {questionLog.comment.split('```').map((sentence:string, index:number) => (
                              <React.Fragment key={index}>
                              {index % 2 === 0 ? 
                                <ReactMarkdown className="">{sentence}</ReactMarkdown>
                              :
                                <CodeBlock className={"language-" + programmingLangs[questionLog.lang]} children={sentence.substring(sentence.indexOf('\n')+1)}/>
                              }
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>  
                  :
                    <div className='historyDetails-Corner'>
                      <div className='historyDetails'>
                        <div className='LogSubTitle'>
                          詳細履歴
                        </div>
                        <div className='logHistoryDetailsData'>
                          {Array.isArray(historyData) && historyData.length !== 0 && (
                            historyData.map((row, index) => {
                              return(
                                <React.Fragment key={index}>
                                  <div className='LogHistory'>
                                    <section className='tof'>
                                      {row.tof === true ? '🟢 ✔':'🟡❌'}
                                    </section>
                                    <section className='lang'>
                                      <b>{row.lang}</b>
                                    </section>
                                    <section className='ques'>
                                      <CustomLink href='' onClick={() => changeViewQuestionLog(row)} preventDefault>
                                        {row.question}
                                      </CustomLink>
                                    </section>
                                  </div>
                                </React.Fragment>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  }
                </React.Fragment>              
              )}
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Log;