"use client";

import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@mui/material';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import NextLink from "next/link";

const InteractiveQandA = () => {

  const [programmingLang, setProgrammingLang] = useState<string>('');
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<String | null>(null);
  const [modelAnswer, setModelAnswer] = useState<string | null>(null);
  const [tof, setTof] = useState<string | null>(null);
  const [comments, setComments] = useState<Array<string>>([]);
  const [isSendAnswer, setIsSendAnswer] = useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [isFillTextArea, setIsFillTextArea] = useState<boolean>(false);
  const [loginUserId, setLoginUserId] = useState<number|null>();
  const answerRef = useRef<HTMLTextAreaElement | null>(null);
  let generateQuestionLock : boolean = false;

  const initStatus = () => {
    setIsSendAnswer(false);
    setQuestion(null);
    setTof(null);
    setComments([]);
    generateQuestionLock = false;
  }

  const generateQuestion = async() => {
    await apiClient.post("/gemini/generateQuestion", {
      pl:programmingLang
    }).then((responce: any) => {
      console.log(responce.data.returnData.question);
      console.log(responce.data.returnData.modelAnswer);
      setQuestion(responce.data.returnData.question);
      setModelAnswer(responce.data.returnData.modelAnswer);
    })
  };

  const hundleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSendAnswer === false) {
      setIsSendAnswer(true);  // 2回目のsubmitを無効化する
      setAnswer(answerRef.current !== null ? answerRef.current?.value : "");
      if (answer !== "") {
        await apiClient.post("gemini/answerCheck", {
          question,
          answer,
          modelAnswer,
          pl: programmingLang
        }).then((responce:any) => {
          setTof(responce.data.returnData.tof);
          const resComments = Object.keys(responce.data.returnData).map((key :string) => responce.data.returnData[key]);  // 複数あるコメントを任意の数記録
          setComments(resComments);
        })
      }
    }
  };

  const handleReload = async() => {
    if (loginUserId !== null) {
      await apiClient.post("db/QandARegister", {
        question,
        answer,
        modelAnswer,
        tof,
        comment: comments.slice(1).join('\n'),
        lang: programmingLang,
        userId: loginUserId
       }).then((response:any) => {
        console.log(response);
       });
    }
    initStatus();
    const now = questionCount;
    setQuestionCount(now + 1);
  }

  const handleBackPage = () => {
    //localStorage.removeItem('pl');
  }

  useEffect(() => {

    const loadPlFromLocalStorage = () => {

      let newProgrammingLang;
      if (localStorage.getItem('pl') === null) {
        newProgrammingLang = 'java';
      }else {
        const storedLang = localStorage.getItem('pl');
        newProgrammingLang = storedLang !== null ? storedLang : programmingLang;
      }

      setProgrammingLang(newProgrammingLang);
    }

    loadPlFromLocalStorage();
    const userId = Number(localStorage.getItem('loginUserId'));
    setLoginUserId(userId);
  }, []);

  useEffect(() => {
  
    console.log("pl=" + programmingLang);
    console.log("pl(localStorage)=" + localStorage.getItem("pl"));

    if (programmingLang !== '' && !generateQuestionLock) {
      generateQuestion();
      generateQuestionLock = true;
    }
  }, [programmingLang, questionCount])

  const changeWord = () => {
    setIsFillTextArea(answerRef.current !== null && answerRef.current?.value !== "" ? true : false);
  }

  return (
    <div className='interactiveQandA h-screen'>
      <div className="Header">
        <Header/>
      </div>
      <div className="MainContainer h-full flex">
        <Sidebar/>
        <div className="MyBody">
          <div className="QandABody">
          {question !== null && (
            <div className="Question">
              {question.split('```').map((sentence, index) => (
                <React.Fragment key={index}>
                  {index % 2 === 0 ? 
                    <ReactMarkdown className="">{sentence}</ReactMarkdown>
                  :
                    <CodeBlock className={"language-" + programmingLang} children={sentence.substring(sentence.indexOf('\n')+1)}/>
                  }
                </React.Fragment>
              ))}
            </div>
          )}
          {question !== null && (
            <div className="Answer">
              <h2>解答を入力</h2>
              <form onSubmit={hundleSubmit}>
                <textarea className="Answer-text" rows={8} name="answer" onChange={changeWord} ref={answerRef}/>
                {isSendAnswer === false && isFillTextArea === true && (
                  <input type="submit" value="解答"/>
                )}
              </form>
            </div>
          )}
          </div>
          <div className="DescBody">
          {tof !== null && comments[0] !== "" && (
            <div className="Description">
              <p>{tof === 'Apple' ? "正解" : "不正解"}</p>
              {comments.map((comment, index) => (
                <React.Fragment key={index}>
                {comment !== 'Apple' && comment !== 'Grape' && comment !== 'Orange' ? 
                  (comment.split("```").map((sentence, i) => (
                    <React.Fragment key={i}>
                    {i % 2 === 0 ? 
                      <ReactMarkdown>{sentence.replace('\n', '')}</ReactMarkdown>
                      :
                      <CodeBlock className={"language-" + programmingLang} children={sentence.substring(sentence.indexOf('\n')+1)}/>
                    }
                    </React.Fragment>
                  )))
                : ''}
                </React.Fragment>
              ))}
            </div>
          )}
          </div>
          <div>
            <NextLink href="/" passHref>
              <Button className="BackButton" variant="outlined" color="warning" onClick={handleBackPage}>もどる</Button>
            </NextLink>
          </div>
          {tof !== null && comments[0] !== "" && (
            <div className="">
              <Button className="NextButton" variant="contained" color="success" onClick={handleReload}>次の問題</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InteractiveQandA
