import useMain from "@/hooks/useMain";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function SignIn({notify}) {
  const navigate=useNavigate();
  const { adminLogin } = useMain();
  const [value, setValue] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(value);
    let ans = await adminLogin(value);
    // console.log(ans);
    if(ans.status)
    {
      localStorage.setItem('reel_rivals_token', ans.token);
      localStorage.setItem('reel_rivals_user', JSON.stringify(ans.user));
      navigate('/dashboard/home');
      notify('success', ans.message);
    }
    else
    {
      notify('error', ans.message)
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Reel Rivals Admin</Typography>
          <Typography variant="h4" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>

        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              name="email"
              onChange={handleChange}
              value={value.email}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              name="password"
              onChange={handleChange}
              value={value.password}
            />
          </div>

          <Button type="submit" children="Sign In" className="mt-6" fullWidth>
            Sign In
          </Button>
        </form>
      </div>

      {/* <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div> */}

    </section>
  );
}

export default SignIn;
