import React, { useState, useEffect, useContext } from 'react';
import { Alert } from 'reactstrap';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';

/*

Component ini diakses ketika user mengakses "/register"

untuk penjelasan mengenai component ini kurang lebih sama dengan component Login sebelumnya
bedanya di register ini kita tidak meng-assign item localStorage dengan method login yang berasal
dari global / context

*/

function Register() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    country_code: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingPage, setLoadingPage] = useState(false);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // jika global state user tidak kosong / dalam keadaan login
    // maka tidak di redirect ke halaman utama
    if (user) navigate('/check-document');
  }, [user, navigate]);

  useEffect(() => {
    getListCountry();
  }, []);

  const registerUser = async (e) => {
    try {
      e.preventDefault(); // <-- untuk mencegah refresh
      setIsLoading(false);
      setErrorMessage('');
      setSuccessMessage('');
      if (Object.values(form).every((value) => value !== '')) {
        setIsLoading(true);
        form.country_code = form.country_code.value;
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/users/register`,
          form,
          {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          }
        );
        setSuccessMessage(`Berhasil Membuat Akun dengan email: ${form.email}`);
        setForm({
          name: '',
          username: '',
          email: '',
          password: '',
          country_code: ''
        });
      } else {
        setErrorMessage('Harap isi semua form');
      }
    } catch (error) {
      setErrorMessage(error.response.data.message ?? error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getListCountry = async () => {
    setLoadingPage(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/countries?pagination=9999&page=0`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );
      const { data } = response;
      const listCountry = data.data.map((val) => {
        return {
          value: val.code,
          label: val.name
        };
      });
      setCountries(listCountry);
    } catch (err) {
      console.log(err);
      setCountries([]);
    } finally {
      setLoadingPage(false);
    }
  };

  return loadingPage ? (
    <div></div>
  ) : (
    <div className="container">
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={registerUser}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Register</h3>
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
            <div className="form-group mt-3">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="e.g Jane Doe"
                onClick={() => setErrorMessage('')}
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                minLength={7}
                required
              />
            </div>
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
              <label>Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Email Address"
                onClick={() => setErrorMessage('')}
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                minLength={12}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label>Negara</label>
              <Select
                options={countries}
                value={form.country_code}
                onChange={(event) => {
                  setForm({
                    ...form,
                    country_code: event
                  });
                }}
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
                {isLoading ? 'Loading...' : 'Register'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
