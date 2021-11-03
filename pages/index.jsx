import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

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
        /*const file = new File([blob], event.target[0].files[0].name + ".zip", {
          type: "application/zip",
        });*/
        const link = URL.createObjectURL(blob);
        setFile(link)
        console.log(link);
        //location.assign(link);
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

      <main>
        <section className="text-center my-5 py-5">
          <h1>API ZIP</h1>
          <h2>welcome</h2>
        </section>
        <section className="container">
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
        <section className="text-center">
          {file ? <a href={file}>Download</a> : null}
        </section>
      </main>

      <footer className="footer text-center align-middle my-3">
        <a
          href="https://github.com/Slender1808/api-zip"
          target="_blank"
          rel="noopener noreferrer"
          className="d-inline-flex align-items-center link-dark text-decoration-non"
        >
          <Image
            src="/ico-black.svg"
            alt="API ZIP Logo"
            width="24px"
            height="24px"
          />
          <span className="fs-5 ms-2">github.com/Slender1808/api-zip</span>
        </a>
      </footer>
    </div>
  );
}
