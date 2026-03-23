import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { FaTrashCan } from "react-icons/fa6";

function DeleteModal({
  show,
  onClose,
  onConfirm,
}: {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal dismissible show={show} onClose={onClose} size="xl" className="">
      <ModalHeader>Are you sure?</ModalHeader>
      <ModalBody className="flex gap-5">
        <Button color="red" onClick={onConfirm}>
          <FaTrashCan className="mr-2 h-5 w-5" /> Delete
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </ModalBody>
    </Modal>
  );
}

export default DeleteModal;
