import React, { useRef, useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown';
import { apiClient } from '@/lib/apiClient';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const interactiveQandA = () => {

  const [question, setQuestion] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);
  const [tof, setTof] = useState<string | null>(null);
  const [comments, setComments] = useState<Array<string>>([]);
  const answerRef = useRef<HTMLTextAreaElement | null>(null);
  let submitLock = false;

  const generateQuestion = async() => {
    const programmingLang = "C";
    await apiClient.post("/gemini/generateQuestion", {
      pl:programmingLang
    }).then((responce: any) => {
      console.log(responce.data.returnData.question);
      setQuestion(responce.data.returnData.question);
    })
  };

  const countUp = () => {
    const now = count;
    setCount(now + 1);
  };

  const hundleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitLock === false) {
      submitLock = true;  // 2回目のsubmitを無効化する
      const answer = answerRef.current !== null ? answerRef.current?.value : "";
      if (answer !== "") {
        await apiClient.post("gemini/answerCheck", {
          question,
          answer
        }).then((responce:any) => {
          setTof(responce.data.returnData.tof);
          const resComments = Object.keys(responce.data.returnData).map((key :string) => responce.data.returnData[key]);  // 複数あるコメントを任意の数記録
          setComments(resComments);
        })
      }
    }
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    countUp();
  }, [question]);

  return (
    <div className='interactiveQandA h-screen'>
      <div className="Header">
        <Header/>
      </div>
      <div className="MainContainer h-full flex">
        <Sidebar/>
        <div className="MyBody">
          {question !== null && (
            <div>
              {question.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  <ReactMarkdown>{line}</ReactMarkdown>
                </React.Fragment>
              ))}
            </div>
          )}
          {question !== null && (
            <div>
              <h2>解答を入力</h2>
              <form onSubmit={hundleSubmit}>
                <textarea rows={4} cols={40} name="answer" placeholder="解答を入力" ref={answerRef}/>
                <input type="submit" value="解答"/>
              </form>
            </div>
          )}
          {tof !== null && comments[0] !== "" && (
            <div>
              <h1>--------------------------------------</h1>
              <p>{tof === 'Y' ? "正解" : "不正解"}</p>
              {comments.map((comment, index) => (
                comment.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    <ReactMarkdown>{line}</ReactMarkdown>
                  </React.Fragment>
                ))
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default interactiveQandA
