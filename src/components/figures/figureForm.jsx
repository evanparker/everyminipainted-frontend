import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify/unstyled";
import { getFigure, postFigure, putFigure } from "../../services/figure";
import { putImage } from "../../services/image";
import { getManufacturersBySearch } from "../../services/manufacturer";
import UserContext from "../../userContext";
import toBool from "../../util/toBool";
import AutoCompleteInput from "../autoCompleteInput";
import ImageSortContainer from "../images/imageSortContainer";
import S3DragAndDrop from "../images/s3DragAndDrop";
import ImageTextFieldModal from "../images/imageTextFieldModal";
import SaveToast from "../toasts/saveToast";

const FigureForm = ({ mode }) => {
  const { user } = useContext(UserContext);
  const [figure, setFigure] = useState({
    name: "",
    partNumber: "",
    website: "",
    description: "",
    artist: "",
    images: [],
  });
  const [canEdit, setCanEdit] = useState(false);
  const [manufacturerSearch, setManufacturerSearch] = useState("");
  const [manufacturerResults, setManufacturerResults] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState();
  const [manufacturerDropdownOpen, setManufacturerDropdownOpen] =
    useState(false);
  const [showTextFieldModal, setShowTextFieldModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageObj, setImageObj] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFigureData = async () => {
      const figureData = await getFigure(id);
      setSelectedManufacturer(figureData.manufacturer);
      setFigure({
        name: "",
        partNumber: "",
        website: "",
        description: "",
        artist: "",
        images: [],
        ...figureData,
      });
    };

    if (mode === "edit") {
      fetchFigureData();
    }
  }, [mode, id]);

  useEffect(() => {
    if (
      (import.meta.env.VITE_EDIT_FIGURE_REQUIRES_ADMIN !== undefined &&
        toBool(import.meta.env.VITE_EDIT_FIGURE_REQUIRES_ADMIN) === false) ||
      user?.roles?.includes("admin")
    ) {
      setCanEdit(true);
    }
  }, [user]);

  const handleSort = (position1, position2) => {
    const imagesClone = [...figure.images];
    const temp = imagesClone[position1];
    imagesClone[position1] = imagesClone[position2];
    imagesClone[position2] = temp;
    setFigure({ ...figure, images: imagesClone });
  };

  const handleDelete = (index) => {
    const imagesClone = figure.images;
    const removedImages = imagesClone.splice(index, 1);
    const newFigureObject = { ...figure, images: imagesClone };
    if (removedImages[0]?._id === figure.thumbnail._id) {
      newFigureObject.thumbnail = imagesClone[0];
    }
    setFigure(newFigureObject);
  };

  const handleSetThumbnail = (id) => {
    setFigure((prevFigure) => ({ ...prevFigure, thumbnail: id }));
  };

  const handleSubmit = async (e) => {
    let figureData;
    e.preventDefault();
    if (mode === "edit") {
      figureData = await putFigure(figure._id, {
        ...figure,
        manufacturer: selectedManufacturer,
      });
    } else if (mode === "new") {
      figureData = await postFigure({
        ...figure,
        manufacturer: selectedManufacturer,
      });
    }
    if (figureData) {
      toast(SaveToast, {
        data: {
          message: `${figure.name} Saved.`,
        },
      });
      navigate(`/figures/${id || figureData._id || ""}`);
    }
  };

  const addImages = async (newImages) => {
    let images = figure.images;
    images = [...newImages, ...images];
    setFigure((prevFigure) => ({
      ...prevFigure,
      images,
      thumbnail: prevFigure.thumbnail || images[0],
    }));
  };

  const handleNameChange = (e) => {
    e.preventDefault();
    setFigure((prevFigure) => ({ ...prevFigure, name: e.target.value }));
  };

  const handleDescriptionChange = (e) => {
    e.preventDefault();
    setFigure((prevFigure) => ({ ...prevFigure, description: e.target.value }));
  };

  const handleWebsiteChange = (e) => {
    e.preventDefault();
    setFigure((prevFigure) => ({ ...prevFigure, website: e.target.value }));
  };

  const handlePartNumberChange = (e) => {
    e.preventDefault();
    setFigure((prevFigure) => ({ ...prevFigure, partNumber: e.target.value }));
  };

  const handleArtistChange = (e) => {
    e.preventDefault();
    setFigure((prevFigure) => ({ ...prevFigure, artist: e.target.value }));
  };

  const chooseManufacturer = (manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setManufacturerSearch(manufacturer?.name || "");
    setManufacturerDropdownOpen(false);
  };

  const handleManufacturerSearchChange = async (e) => {
    e.preventDefault();
    setManufacturerSearch(e.target.value);
    const manufacturers = await getManufacturersBySearch(e.target.value, {
      limit: 20,
      offset: 0,
    });
    setManufacturerDropdownOpen(true);
    setManufacturerResults(manufacturers.docs);
  };

  const handleManufacturerSearchBlur = (e) => {
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      setManufacturerDropdownOpen(false);
    }
  };

  const handleImageSave = async () => {
    const imagesClone = [...figure.images];
    imagesClone[selectedImageIndex] = imageObj;
    setFigure({ ...figure, images: imagesClone });
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
    setImageObj(figure?.images[index]);

    setShowTextFieldModal(true);
  };

  return (
    <>
      {figure && canEdit && (
        <div>
          <ImageTextFieldModal
            imageObj={imageObj}
            show={showTextFieldModal}
            onClose={() => setShowTextFieldModal(false)}
            onConfirm={handleImageSave}
            setImageObj={setImageObj}
          />
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="max-w-lg block">
              <Label htmlFor="name1">Name</Label>
              <TextInput
                id="name1"
                type="text"
                value={figure.name}
                onChange={handleNameChange}
                required={true}
              />
            </div>

            <div className="max-w-lg block">
              <Label htmlFor="partNumber1">Part Number</Label>
              <TextInput
                id="partNumber1"
                type="text"
                value={figure.partNumber}
                onChange={handlePartNumberChange}
              />
            </div>

            <div className="max-w-lg block">
              <Label htmlFor="website1">Website</Label>
              <TextInput
                id="website1"
                type="text"
                value={figure.website}
                onChange={handleWebsiteChange}
              />
            </div>

            <div className="max-w-lg block">
              <Label htmlFor="description1">Description</Label>
              <Textarea
                id="description1"
                rows={4}
                onChange={handleDescriptionChange}
                value={figure.description}
              />
            </div>

            <div className="max-w-lg block">
              <Label htmlFor="artist1">Artist</Label>
              <TextInput
                id="artist1"
                type="text"
                value={figure.artist}
                onChange={handleArtistChange}
              />
            </div>

            <div className="max-w-lg block">
              <Label htmlFor="manufacturer1">Manufacturer</Label>
              {selectedManufacturer ? (
                <div className="ml-4 py-2 dark:text-white">
                  {selectedManufacturer.name}
                </div>
              ) : (
                <div className="ml-4 py-2 dark:text-gray-500 text-gray-700">
                  None
                </div>
              )}

              <AutoCompleteInput
                chooseItem={chooseManufacturer}
                dropdownOpen={manufacturerDropdownOpen}
                setDropdownOpen={setManufacturerDropdownOpen}
                onChange={handleManufacturerSearchChange}
                onFocus={handleManufacturerSearchChange}
                value={manufacturerSearch}
                items={manufacturerResults}
                onBlur={handleManufacturerSearchBlur}
              />
            </div>

            <div className="block">
              <div className="max-w-lg">
                <Label htmlFor="images1">Images</Label>
                <S3DragAndDrop addImages={addImages} />
              </div>
              <div className="mt-5">
                <ImageSortContainer
                  onSort={handleSort}
                  onDelete={handleDelete}
                  images={figure.images}
                  onEdit={handleImageEdit}
                  thumbnail={figure.thumbnail}
                  onSetThumbnail={handleSetThumbnail}
                />
              </div>
            </div>
            <div className="max-w-lg">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default FigureForm;
