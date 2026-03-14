import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify/unstyled";
import {
  getManufacturer,
  postManufacturer,
  putManufacturer,
} from "../../services/manufacturer";
import UserContext from "../../userContext";
import ImageSortContainer from "../images/imageSortContainer";
import S3DragAndDrop from "../images/s3DragAndDrop";
import SocialsForm from "../socialsForm";
import SaveToast from "../toasts/saveToast";
import toBool from "../../util/toBool";
import { putImage } from "../../services/image";
import ImageTextFieldModal from "../images/imageTextFieldModal";

const ManufacturerForm = ({ mode }) => {
  const { user } = useContext(UserContext);
  const [manufacturer, setManufacturer] = useState({
    name: "",
    description: "",
    website: "",
    images: [],
    socials: [],
  });
  const [canEdit, setCanEdit] = useState(false);
  const [socials, setSocials] = useState([]);
  const [showTextFieldModal, setShowTextFieldModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageObj, setImageObj] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManufacturerData = async () => {
      const manufacturerData = await getManufacturer(id);
      setManufacturer({
        name: "",
        description: "",
        website: "",
        images: [],
        socials: [],
        ...manufacturerData,
      });
      setSocials(manufacturerData.socials);
    };
    if (mode === "edit") {
      fetchManufacturerData();
    }
  }, [mode, id]);

  useEffect(() => {
    if (
      user?.roles?.includes("admin") ||
      (import.meta.env.VITE_EDIT_MANUFACTURER_REQUIRES_ADMIN !== undefined &&
        toBool(import.meta.env.VITE_EDIT_MANUFACTURER_REQUIRES_ADMIN) === false)
    ) {
      setCanEdit(true);
    }
  }, [user]);

  const handleSort = (position1, position2) => {
    const imagesClone = [...manufacturer.images];
    const temp = imagesClone[position1];
    imagesClone[position1] = imagesClone[position2];
    imagesClone[position2] = temp;
    setManufacturer({ ...manufacturer, images: imagesClone });
  };

  const handleDelete = (index) => {
    const imagesClone = manufacturer.images;
    const removedImages = imagesClone.splice(index, 1);
    const newManufacturerObject = { ...manufacturer, images: imagesClone };
    if (removedImages[0]?._id === manufacturer.thumbnail._id) {
      newManufacturerObject.thumbnail = imagesClone[0];
    }
    setManufacturer(newManufacturerObject);
  };

  const handleSetThumbnail = (id) => {
    setManufacturer((prevManufacturer) => ({
      ...prevManufacturer,
      thumbnail: id,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let manufacturerData;
    if (mode === "edit") {
      manufacturerData = await putManufacturer(manufacturer._id, {
        ...manufacturer,
        socials,
      });
    } else if (mode === "new") {
      manufacturerData = await postManufacturer({ ...manufacturer, socials });
    }
    if (manufacturerData) {
      toast(SaveToast, {
        data: {
          message: `${manufacturer.name} Saved.`,
        },
      });
      navigate(`/manufacturers/${id || manufacturerData._id || ""}`);
    }
  };

  const addImages = async (newImages) => {
    let images = manufacturer.images;
    images = [...images, ...newImages];
    setManufacturer((prevManufacturer) => ({
      ...prevManufacturer,
      images,
      thumbnail: prevManufacturer.thumbnail || images[0],
    }));
  };

  const handleNameChange = (e) => {
    e.preventDefault();
    setManufacturer((prevManufacturer) => ({
      ...prevManufacturer,
      name: e.target.value,
    }));
  };

  const handleDescriptionChange = (e) => {
    e.preventDefault();
    setManufacturer((prevManufacturer) => ({
      ...prevManufacturer,
      description: e.target.value,
    }));
  };

  const handleWebsiteChange = (e) => {
    e.preventDefault();
    setManufacturer((prevManufacturer) => ({
      ...prevManufacturer,
      website: e.target.value,
    }));
  };

  const handleImageSave = async () => {
    const imagesClone = [...manufacturer.images];
    imagesClone[selectedImageIndex] = imageObj;
    setManufacturer({ ...manufacturer, images: imagesClone });
    const imageResponse = await putImage(imageObj._id, imageObj);
    if (imageResponse) {
      toast(SaveToast, {
        data: {
          message: `Image Data Saved.`,
        },
      });
    }

    setShowTextFieldModal(false);
  };

  const handleImageEdit = (index) => {
    setSelectedImageIndex(index);
    setImageObj(manufacturer?.images[index]);

    setShowTextFieldModal(true);
  };

  return (
    <>
      {manufacturer && canEdit && (
        <div>
          <ImageTextFieldModal
            imageObj={imageObj}
            show={showTextFieldModal}
            onClose={() => setShowTextFieldModal(false)}
            onConfirm={handleImageSave}
            setImageObj={setImageObj}
          />

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="block max-w-lg">
              <Label htmlFor="name1">Name</Label>
              <TextInput
                id="name1"
                type="text"
                value={manufacturer.name}
                onChange={handleNameChange}
                required={true}
              />
            </div>

            <div className="block max-w-lg">
              <Label htmlFor="description1">Description</Label>
              <Textarea
                id="description1"
                rows={4}
                onChange={handleDescriptionChange}
                value={manufacturer.description}
              />
            </div>

            <div className="block max-w-lg">
              <Label htmlFor="website1">Website</Label>
              <TextInput
                id="website1"
                type="text"
                onChange={handleWebsiteChange}
                value={manufacturer.website}
              />
            </div>

            <SocialsForm socials={socials} setSocials={setSocials} />

            <div className="block">
              <div className="block max-w-lg">
                <Label htmlFor="images1">Images</Label>
                <S3DragAndDrop addImages={addImages} />
              </div>

              <div className="mt-5">
                <ImageSortContainer
                  onSort={handleSort}
                  onDelete={handleDelete}
                  images={manufacturer.images}
                  onEdit={handleImageEdit}
                  thumbnail={manufacturer.thumbnail}
                  onSetThumbnail={handleSetThumbnail}
                />
              </div>
            </div>

            <div className="block max-w-lg">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ManufacturerForm;
