import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NextLink from "next/link";
import {Button, Link as MuiLink, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent} from "@mui/material/";

const inter = Inter({ subsets: ["latin"] });

// 最初に選択画面 & ボタンを配置
// 初期画面で、出題言語を選択し、問題出題&解答ボタンを押して開始

export default function Home() {

  const programmingLangs: { [key : string] : string } = {
    'Java' : 'java',
    'C++' : 'c++',
    'JavaScript' : 'javascript'
  };
  const [selectedLang, setSelectedLang] = useState<string>(programmingLangs['Java']);

  useEffect(() => {
    if (localStorage.getItem('pl') !== null) {
      const storedLang = localStorage.getItem('pl');
      setSelectedLang(storedLang !== null ? storedLang : selectedLang);
    }
    console.log(selectedLang);
    localStorage.setItem('loginUser', 'wantun');
    localStorage.setItem('loginUserId', '29');
  }, [])

  const handleSelectLang = (e:SelectChangeEvent<string>) => {
    setSelectedLang(e.target.value);
  }

  useEffect(() => {
    localStorage.setItem('pl', selectedLang);
    console.log(selectedLang);
  }, [selectedLang]);

  return (
    <main className="h-screen">
      <div className="Header">
        <Header/>
      </div>
      <div className="MainContainer h-full flex">
        <Sidebar/>
        <div className="MyBody">
          <div className="SelectLanguageText">
            出題言語:
          </div>
          <div>
            <FormControl className="SelectLanguage">
              <InputLabel id="laguage-select-label">言語を選択</InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={selectedLang}
                label="selectLang"
                onChange={handleSelectLang}
              >
                {Object.keys(programmingLangs).map((lang, index) => (
                    <MenuItem
                      key={index}
                      value={programmingLangs[lang]}
                    >{lang}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <NextLink 
            href={"./InteractiveQandA"} as="" passHref>
            <Button className="StartButton" variant='outlined' size="large">問題を解く</Button>
          </NextLink>
        </div>
      </div>
    </main>
  );
}
