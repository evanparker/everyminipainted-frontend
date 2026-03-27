import { useContext, useEffect, useState } from "react";
import { getInvites, postInvite } from "../../services/invite";
import { useNavigate } from "react-router-dom";
import {
  Button,
  HelperText,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import UserContext from "../../userContext";

const GenerateInvite = () => {
  const { user } = useContext(UserContext);
  const [invites, setInvites] = useState<{ code: string; createdAt: Date }[]>(
    [],
  );
  const [inviteCode, setInviteCode] = useState("");
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user !== undefined && !user?.roles?.includes("admin")) {
      navigate("/404", { replace: true });
    }
    const fetchData = async () => {
      const results = await getInvites();
      results.sort(
        (a: { createdAt: Date }, b: { createdAt: Date }) =>
          parseInt(new Date(b.createdAt).getTime().toString()) -
          parseInt(new Date(a.createdAt).getTime().toString()),
      );
      setInvites(results);
    };
    if (user?.roles?.includes("admin")) {
      fetchData();
    }
  }, [user, navigate]);

  const handleInviteCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInviteCode(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const invite = await postInvite({ code: inviteCode });
      if (invite) {
        setInviteCode("");
        setFormError("");
        setInvites((prevInvites) => [invite, ...prevInvites]);
      }
    } catch (error) {
      setFormError(
        (error as { response?: { message?: string } }).response?.message ||
          "An error occurred.",
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-10">
        <div className="max-w-lg block">
          <Label htmlFor="inviteCode1">Invite Code</Label>
          <TextInput
            id="inviteCode1"
            type="text"
            value={inviteCode}
            onChange={handleInviteCodeChange}
            required={true}
          />
          {formError && <HelperText color="failure">{formError}</HelperText>}
        </div>
        <div className="max-w-lg">
          <Button type="submit">Save</Button>
        </div>
      </form>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>Invite Codes</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {invites.map((invite) => (
            <TableRow
              key={invite.code}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <TableCell>{invite.code}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default GenerateInvite;
