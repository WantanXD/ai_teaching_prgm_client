import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ghcolors } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type Props = {
    className? : string;
    children? : React.ReactNode;
}

const CodeBlock: React.FC<Props> = ({ className, children = "" }: Props) => {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1] ? match[1] : '';
  const code = String(children).replace('/\n$/', '');

  console.log("lang:" + lang)
  console.log("code:" + code)
  console.log("className:" + className)
  return (
    <SyntaxHighlighter
      style={ghcolors}
      language={lang}
      className="">
        {code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
