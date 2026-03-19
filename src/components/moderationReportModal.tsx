import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Radio,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { FaFlag } from "react-icons/fa6";
import moderationReportReasons from "../constants/moderationReportReasons";

function ModerationReportModal({ show, onClose, onConfirm }: { show: boolean; onClose: () => void; onConfirm: (data: { reason: string; description: string }) => void }) {
  const [reason, setReason] = useState(moderationReportReasons[0].name);
  const [description, setDescription] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onConfirm({ reason, description });
    setReason(moderationReportReasons[0].name);
    setDescription("");
    onClose();
  };

  const onReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  };

  const clearModalAndClose = () => {
    setReason(moderationReportReasons[0].name);
    setDescription("");
    onClose();
  };

  return (
    <Modal
      dismissible
      show={show}
      onClose={clearModalAndClose}
      size="xl"
      className=""
    >
      <ModalHeader>Report Mini</ModalHeader>
      <ModalBody className="flex gap-5">
        <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="reasons">Reason</Label>
            </div>
            {moderationReportReasons.map((r) => (
              <div key={r.name} className="flex items-center gap-2">
                <Radio
                  id={r.name}
                  name="reasons"
                  value={r.name}
                  onChange={onReasonChange}
                  checked={reason === r.name}
                />
                <Label htmlFor={r.name}>{r.description}</Label>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="description1">Description</Label>
            </div>
            <TextInput
              id="description1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-5">
            <Button type="submit" color="red">
              <FaFlag className="mr-2 h-5 w-5" /> Report
            </Button>
            <Button color="gray" onClick={clearModalAndClose}>Cancel</Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}

export default ModerationReportModal;
