import { useEffect, useState } from "react";
import { postForgotPassword } from "../../services/auth";
import { Button, HelperText, Label, TextInput } from "flowbite-react";
import { toast } from "react-toastify/unstyled";
import ForgotPasswordToast from "../toasts/forgotPasswordToast";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText("");
    try {
      const data = await postForgotPassword({ email });
      if (data) {
        toast(ForgotPasswordToast, {
          data: {
            message: `Forgot password email sent to ${email}`,
          },
        });
        navigate(`/login`);
      }
    } catch (error) {
      setErrorText(
        (error as { response?: { message?: string } }).response?.message ||
          "An error occurred.",
      );
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Email Address</Label>
          </div>
          <TextInput
            id="email1"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <HelperText color="failure">{errorText}</HelperText>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
