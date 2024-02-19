import React, { useRef, useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown';
import { apiClient } from '@/lib/apiClient';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

const InteractiveQandA = () => {

  const [question, setQuestion] = useState<string | null>(null);
  const [modelAnswer, setModelAnswer] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);
  const [tof, setTof] = useState<string | null>(null);
  const [comments, setComments] = useState<Array<string>>([]);
  const answerRef = useRef<HTMLTextAreaElement | null>(null);
  const [isSendAnswer, setIsSendAnswer] = useState<boolean>(false);
  const programmingLang = "java";

  const initStatus = () => {
    setIsSendAnswer(false);
    setQuestion(null);
    setCount(0);
    setTof(null);
    setComments([]);
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

  const countUp = () => {
    const now = count;
    setCount(now + 1);
  };

  const hundleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSendAnswer === false) {
      setIsSendAnswer(true);  // 2回目のsubmitを無効化する
      const answer = answerRef.current !== null ? answerRef.current?.value : "";
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

  useEffect(() => {
    initStatus();
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
                <textarea className="Answer-text" rows={8} name="answer" ref={answerRef}/>
                {isSendAnswer === false && (<input type="submit" value="解答"/>)}
              </form>
            </div>
          )}
        </div>
        <div className="DescBody">
          {tof !== null && comments[0] !== "" && (
            <div className="Description">
              <p>{tof === 'Y' ? "正解" : "不正解"}</p>
              {comments.map((comment, index) => (
                <React.Fragment key={index}>
                {comment !== 'Y' && comment !== 'Great' ? 
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
        </div>
      </div>
    </div>
  )
}

export default InteractiveQandA
