import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="h-screen">
      <div className="h-30">
        <Header/>
      </div>
      <div>
        <Link href="./Authenticate">あああ</Link>
      </div>
    </main>
  );
}
