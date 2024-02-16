import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NextLink from "next/link";
import {Button, Link as MuiLink} from "@mui/material/";

const inter = Inter({ subsets: ["latin"] });

// 最初に選択画面 & ボタンを配置
// 初期画面で、出題言語を選択し、問題出題&解答ボタンを押して開始

export default function Home() {

  return (
    <main className="h-screen">
      <div className="Header">
        <Header/>
      </div>
      <div className="MainContainer h-full flex">
        <Sidebar/>
        <div className="MyBody">
          <NextLink href="./InteractiveQandA" passHref>
            <Button className="StartButton" variant='outlined'>問題を解く</Button>
          </NextLink>
        </div>
      </div>
      <div>
        <Link href="./InteractiveQandA">しゅつだい</Link>
      </div>
    </main>
  );
}
