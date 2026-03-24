import { Button } from "flowbite-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../userContext";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <Button type="submit">Logout</Button>
        </form>
      </div>
    </>
  );
};

export default Logout;
