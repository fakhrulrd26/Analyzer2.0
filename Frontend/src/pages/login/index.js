import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'reactstrap';
import '../../css/auth.css';
import { AuthContext } from '../../context/authContext';

/*

Component ini diakses ketika user mengakses "/login"

*/

function Login() {
  // pada component ini kita mengambil satu method dan satu state dari global / context
  // login adalah method untuk memasang item localStorage untuk keperluan authentication
  // user adalah state yang akan digunakan untuk mengecek apakah user sudah login atau belum
  const { login, user } = useContext(AuthContext);

  // variable navigate isinya adalah method useNavigate() yang
  // dapat digunakan untuk redirect ke halaman tertentu
  // pada component ini digunakan untuk redirect ke halaman check-document
  // apabila sudah login
  const navigate = useNavigate();

  // pada form login memiliki dua field yaitu username dan password
  // yang akan dikirim ke Backend melalui method loginUser di bawah
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  // errorMessage & successMessage adalah local state yang digunakan untuk
  // menampilkan error atau success message ketika proses login
  // untuk meng-assign value dari state errorMessage & successMessage
  // dapat dilakukan dengan cara setErrorMessage ataupun successMessage
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // isLoading adalah state yang digunakan untuk men-disable button Login
  // ketika proses login sedang berlangsung
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // useEffect akan berjalan dlu untuk mengecek apakah state user dari global / context
    // ada valuenya. Jika ada valuenya berarti user sudah login dan tidak dapat mengakses
    // halaman login / register
    if (user) navigate('/check-document');
  }, [user, navigate]);

  const loginUser = async (e) => {
    // proses login di lakukan
    try {
      e.preventDefault(); // <-- untuk mencegah refresh
      setIsLoading(false);

      // assign ulang state errorMessage & successMessage
      setErrorMessage('');
      setSuccessMessage('');

      // kondisi ini mengecek apakah semua field yang ada di Login form sudah
      // terisi semua atau belum
      if (Object.values(form).every((value) => value !== '')) {
        setIsLoading(true); // <-- untuk men-disable button Login agar user tidak multiple click apabila proses login dilakukan

        // proses login dilakukan dengan cara memanggil route API dengan method /users/login
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/users/login`,
          form,
          {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          }
        );

        // men set item localStorage dengan value yang didapat dari Backend
        await login(response.data.data);
        setSuccessMessage(`Berhasil Login`); // <-- menampilkan success message

        // check localstorage
        if (!localStorage.getItem('is_review_app')) {
          localStorage.setItem('is_review_app', JSON.stringify({ value: 0 }));
        }

        // melakukan reset value terhadap state form
        setForm({
          username: '',
          password: ''
        });

        // setelah login berhasil maka akan langsung di redirect ke halaman check-document
        navigate('/check-document');
      } else {
        // apabila form belum diisi semua
        setErrorMessage('Harap isi semua form');
      }
    } catch (error) {
      setErrorMessage(error.response.data.message ?? error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={loginUser}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Login</h3>
            {successMessage ? (
              <Alert color="success">{successMessage}</Alert>
            ) : (
              <div />
            )}
            {errorMessage ? (
              <Alert color="danger">{errorMessage}</Alert>
            ) : (
              <div />
            )}
            {/*
              apabila inputan di click maka akan meng-assign value errorMessage menjadi string kosong
              value dari inputan username berasal dari state local form dengan attributes username
              ketika user mengisi field username, maka di assign value dari username dengan setForm
            
            */}
            <div className="form-group mt-3">
              <label>Username</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="e.g user1234"
                onClick={() => setErrorMessage('')}
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value
                  })
                }
                minLength={7}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Password"
                onClick={() => setErrorMessage('')}
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value
                  })
                }
                minLength={7}
                required
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-primary"
              >
                {isLoading ? 'Loading...' : 'Login'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
