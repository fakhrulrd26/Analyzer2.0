import React, { createContext, useState, useEffect } from 'react';
import jwt from 'jwt-decode';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // useEffect merupakan method yang dijalankan ketika halaman browser pertama kali di akses / refresh
    // dalam useEffect ini pertama kali yang perlu dilakukan adalah
    // mengecek authentication apakah user sudah login atau belum
    const checkAuthentication = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await refreshUserInformation();
      } else {
        setLoadingAuth(false);
      }
    };
    checkAuthentication();
  }, []);

  // Method / Fungsi untuk handle login
  const login = (token) => {
    // Set dua item localstorage dengan nama accessToken & refreshToken
    // accessToken isinya adalah informasi dari user yang di encoded
    // refreshToken isinya adalah token yang berfungsi untuk men-generate accessToken baru
    // karena accessToken expires dalam 30menit (sesuai setting di Backend)
    localStorage.setItem('accessToken', token.accessToken);
    localStorage.setItem('refreshToken', token.refreshToken);

    // setelah mendapatkan accessToken kita bisa decoded isi accessToken
    const decoded = jwt(token.accessToken);

    // setelah di decoded, kita set di state user dengan setUser
    // agar informasi user dapat diakses di component /page lainnya
    setUser(decoded.user);
  };

  const logout = async () => {
    try {
      axiosInstance
        .post('/users/logout')
        .then((response) => {
          // apabila proses logout selesai maka yang dilakukan adalah
          /*

          1. menghapus state user menjadi null, artinya tidak ada data user yang disimpan karena
             sudah logout
          2. menghapus semua item localstorage dengan key "accessToken" & "refreshToken"
          
          */
          setUser(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          if (localStorage.getItem('is_review_app'))
            localStorage.removeItem('is_review_app');
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const refreshUserInformation = async () => {
    if (localStorage.getItem('refreshToken')) {
      try {
        axiosInstance
          .post('/users/refresh-token', {
            refreshToken: localStorage.getItem('refreshToken')
          })
          .then((response) => {
            const { accessToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            const decoded = jwt(accessToken);
            setUser(decoded.user);
            setLoadingAuth(false);
          })
          .catch((error) => {
            setLoadingAuth(false);
            console.log(error);
          });
      } catch (error) {
        setLoadingAuth(false);
        console.log(error);
      }
    }
  };

  // dengan menerapkan "context", dapat memprovide semua state, method yang ada di component ini dan
  // dapat diakses di component lain
  const authContextValue = {
    user,
    login,
    logout,
    refreshUserInformation
  };

  // di sini sebelum return ada proses loading terlebih dahulu
  // apabila state loadingAuth = true maka proses pengecekan sedang berlangsung
  // apabila state loadingAuth = false maka proses pengecekan telah selesai
  return (
    <AuthContext.Provider value={authContextValue}>
      {loadingAuth ? <div>...</div> : children}
    </AuthContext.Provider>
  );
}
