import useMain from "@/hooks/useMain";
import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function ResetPassword({ notify }) {
  const navigate = useNavigate();
  const { adminResetPassword } = useMain();
  const [value, setValue] = useState({
    currentPassword: '',
    password: '',
    password1: ''
  });

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (value?.password !== value?.password1) {
      notify('error', "Password and Confirm Password must be same! ");
      return;
    }

    let ans = await adminResetPassword(value);
    // console.log(ans);
    if (ans.status) {
      localStorage.clear();
      alert(ans.message);
      window.location.href = '/dashboard/sign-in';
    }
    else {
      notify('error', ans.message);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-6">
        <div className="text-center">
          <Typography variant="h4" className="font-bold mb-1 mt-6">Admin Reset Password</Typography>
        </div>

        <form className="mt-3 mb-2 mx-auto w-80 max-w-screen-lg" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Input
              label="Current Password"
              type="password"
              size="lg"
              placeholder="********"
              name="currentPassword"
              onChange={handleChange}
              value={value.currentPassword}
              required
            />
            <Input
              label="New Password"
              type="password"
              size="lg"
              placeholder="********"
              name="password"
              onChange={handleChange}
              value={value.password}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              size="lg"
              placeholder="********"
              name="password1"
              onChange={handleChange}
              value={value.password1}
              required
            />
          </div>

          <Button type="submit" children="Sign In" className="mt-6" fullWidth>
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
}

export default ResetPassword;
