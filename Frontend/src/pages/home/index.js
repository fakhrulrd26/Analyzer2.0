import React from "react";

/*

Component ini diakses ketika user akses "/"" URL

*/

function Home() {
  return (
    <div className="container">
      <div className="pricing-header p-3 pb-md-4 mx-auto my-auto text-center">
        <h1 className="display-4 fw-normal">File Analyzer</h1>
        <p className="fs-5 text-muted">
          File analyzer adalah sebuah aplikasi yang inovatif dan andal yang
          dirancang khusus untuk membantu pengguna dalam memverifikasi keaslian
          dan keotentikan extension file yang ada. Dengan menggunakan aplikasi
          ini, pengguna dapat dengan mudah memeriksa apakah extension file yang
          diberikan sesuai dengan kontennya, sehingga melindungi diri dari file
          yang berbahaya atau meragukan.
        </p>
      </div>
      {/* <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
        <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm">
            <div className="card-header py-3">
              <h5 className="my-0 fw-normal">Total Pengguna Mendaftar</h5>
            </div>
            <div className="card-body">
              <h2 className="card-title pricing-card-title">100+</h2>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm">
            <div className="card-header py-3">
              <h5 className="my-0 fw-normal">Total Analisis File Dilakukan</h5>
            </div>
            <div className="card-body">
              <h2 className="card-title pricing-card-title">150+</h2>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm">
            <div className="card-header py-3">
              <h5 className="my-0 fw-normal">Total Negara Yang Mendaftar</h5>
            </div>
            <div className="card-body">
              <h2 className="card-title pricing-card-title">3</h2>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Home;
