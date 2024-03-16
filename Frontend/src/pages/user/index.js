import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

/**
 *
 * Component ini digunakan untuk mengecek apakah Route di frontend hanya bisa diakses oleh user yang sudah login
 * untuk penerapannya bisa liat di App.js
 *
 * <UserProtectedRoute>
 *  Di dalam bungkusan dari UserProtectedRoute, maka Component Route yang ingin dapat dilakukan pengecekan apakah user
 *  sudah login atau belum
 * </UserProtectedRoute>
 */

export const UserProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};
