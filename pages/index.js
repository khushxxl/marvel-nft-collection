import Head from "next/head";

import Homescreen from "../components/Homescreen";

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Marvel NFTs</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Homescreen />
    </div>
  );
}
