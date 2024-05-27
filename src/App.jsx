import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "@/layouts";
import { SignIn, SignUp } from "./pages/auth";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import MainState from "./context/MainState";
import { useEffect, useState } from "react";
import Alert from "./Util/Alert";
import { toast } from 'react-toastify';

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const preloader = document.getElementById('preloader');

  if (preloader) {
    setTimeout(() => {
      preloader.style.display = 'none';
      setLoading(false);
    }, 2000);
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, []);

  const notify = (type, message) => {
    if (type === 'success') {
      toast.success(message);
    }
    else {
      toast.error(message);
    }
  };

  return (
    <MainState setProgress={setProgress}>
      <Alert />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/*" element={<Dashboard notify={notify} />} />
          <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
        </Route>

        <Route path="/auth/sign-in" element={<SignIn notify={notify} />} />
        {/* <Route path="/auth/sign-up" element={<SignUp />} /> */}
      </Routes>
    </MainState>
  );
}

export default App;
