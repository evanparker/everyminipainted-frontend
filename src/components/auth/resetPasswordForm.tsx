import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { postResetPassword } from "../../services/auth";
import { Button, Label, TextInput } from "flowbite-react";
import { toast } from "react-toastify/unstyled";
import SaveToast from "../toasts/saveToast";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setToken(searchParams.get("token") || "");
    setUserId(searchParams.get("id") || "");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = await postResetPassword({ userId, token, password });
    if (userData) {
      toast(SaveToast, {
        data: {
          message: `Password was reset.`,
        },
      });
      navigate(`/login`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1">New Password</Label>
          </div>
          <TextInput
            id="password1"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
