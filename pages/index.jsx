import Head from "next/head";
import Image from "next/image";

export default function Home() {
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
          <form
            action="/api/compress/zip"
            method="post"
            encType="multipart/form-data"
          >
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
