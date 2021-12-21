import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";

import { useState } from "react";
import { useRouter } from "next/router";

const Ads = dynamic(() => import("../lib/adaround"), { ssr: false });

export default function Home() {
  const router = useRouter();
  let [load, setLoad] = useState(false);
  let [file, setFile] = useState(null);

  const registerUser = async (event) => {
    setFile(null);
    setLoad(true);
    event.preventDefault();
    console.log(event.target[0].files[0]);

    let data = new FormData();
    data.append("uploaded_file", event.target[0].files[0]);

    fetch("/api/compress/zip", {
      body: data,
      method: "POST",
    })
      .then(async (response) => {
        const blob = await response.blob();
        //const text = await response.text();
        console.log(blob);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          console.log("onloadend", reader);
          const base64data = reader.result.substring(28);
          //console.log(base64data);

          //const text = await blob.text();
          const url = new URL(location.href + "api/decompress/zip");

          //console.log(escape(text));
          url.searchParams.append("blob", base64data);
          console.log(url);
          /*const file = new File([blob], event.target[0].files[0].name + ".zip", {
          type: "application/zip",
        });*/
          //const cmp = new URLSearchParams(url.search);
          //console.log(text == unescape(cmp.get("blob")));
          console.log(url.search);

          const link = URL.createObjectURL(blob);
          setFile(link);
          console.log(link);
          //location.assign(link);
        };
      })
      .finally(() => {
        setLoad(false);
      });
  };

  return (
    <div>
      <Head>
        <title>Api ZIP</title>
        <meta name="description" content="Api ZIP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container text-center my-5 py-5">
        <section>
          <Image
            src="/ico-black.svg"
            alt="API ZIP Logo"
            width="54px"
            height="54px"
          />
          <h1>API ZIP</h1>
          <h2>welcome</h2>
        </section>
        <section>
          <form onSubmit={registerUser}>
            <div className="mb-3">
              <input
                className="form-control"
                name="uploaded_file"
                type="file"
              />
            </div>
            <div className="col-12 px-5 mb-3">
              <button className="btn btn-primary w-100" type="submit">
                Compress
              </button>
            </div>
          </form>
        </section>
        {load == true ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : null}
        <section>
          {file ? (
            <a href={file}>
              <h5>Download</h5>
            </a>
          ) : null}
        </section>
      </main>
      <Ads/>
      

      <footer className="footer text-center align-middle my-3 source code fixed-bottom">
        <a
          href="https://github.com/Slender1808/api-zip"
          target="_blank"
          rel="noopener noreferrer"
          className="link-dark text-decoration-non"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}
