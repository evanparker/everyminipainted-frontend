import { Button, HelperText, Label, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify/unstyled";
import { postLogin } from "../../services/auth";
import UserContext from "../../userContext";
import LogoutToast from "../toasts/logoutToast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText("");
    try {
      const userData = await postLogin({
        email,
        password,
      });
      login(userData);
      toast(LogoutToast, {
        data: {
          message: `Logged in as ${email}.`,
        },
      });
      navigate("/");
    } catch (error) {
      if ((error as { status: number }).status === 401) {
        setErrorText("Invalid username or password.");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Email</Label>
          </div>
          <TextInput
            id="email1"
            type="email"
            placeholder="name@flowbite.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1">Password</Label>
          </div>
          <TextInput
            id="password1"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <HelperText color="failure">{errorText}</HelperText>
          <HelperText>
            <Link
              to="/forgotpassword"
              className="ml-1 font-medium text-cyan-600 hover:underline dark:text-cyan-500"
            >
              Forgot Password?
            </Link>
          </HelperText>
        </div>
        {/* <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div> */}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default Login;
