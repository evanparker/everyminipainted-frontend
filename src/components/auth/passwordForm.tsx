import { Button, Label, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify/unstyled";
import { putPassword } from "../../services/auth";
import UserContext from "../../userContext";
import SaveToast from "../toasts/saveToast";

const PasswordForm = () => {
  const { user } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = await putPassword({ password });
    if (userData) {
      toast(SaveToast, {
        data: {
          message: `Password for ${user?.username} updated.`,
        },
      });
      navigate(`/users/${user?.username}`);
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

export default PasswordForm;
