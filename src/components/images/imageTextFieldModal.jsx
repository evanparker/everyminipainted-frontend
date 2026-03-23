import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { FaFloppyDisk } from "react-icons/fa6";
import S3Image from "./s3Image";

function ImageTextFieldModal({
  imageObj,
  setImageObj,
  show,
  onClose,
  onConfirm,
}) {
  return (
    <Modal dismissible show={show} onClose={onClose} size="xl" className="">
      <ModalHeader>Captions and Alt Text</ModalHeader>
      <ModalBody className="flex gap-5">
        <div className="w-40 h-40">
          {imageObj?.type === "s3Image" ? (
            <S3Image image={imageObj} width={400} height={400} />
          ) : (
            <div></div>
          )}
        </div>
        <div className="flex flex-col gap-5 w-full">
          <div className="max-w-lg block">
            <Label htmlFor="caption">Caption</Label>
            <TextInput
              id="caption"
              type="text"
              value={imageObj?.caption}
              onChange={(e) =>
                setImageObj({ ...imageObj, caption: e.target.value })
              }
            />
          </div>
          <div className="max-w-lg block">
            <Label htmlFor="altText">AltText</Label>
            <TextInput
              id="altText"
              type="text"
              value={imageObj?.altText}
              onChange={(e) =>
                setImageObj({ ...imageObj, altText: e.target.value })
              }
            />
          </div>
          <div className="flex gap-5">
            <Button onClick={() => onConfirm()}>
              <FaFloppyDisk className="mr-2 h-5 w-5" /> Save
            </Button>
            <Button color="alternative" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default ImageTextFieldModal;
