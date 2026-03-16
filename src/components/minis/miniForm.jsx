import { Button, Checkbox, Label, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify/unstyled";
import { getFigure, getFiguresBySearch } from "../../services/figure";
import { putImage } from "../../services/image";
import { getMini, postMini, putMini } from "../../services/mini";
import useUserData from "../../useUserData";
import AutoCompleteInput from "../autoCompleteInput";
import ImageSortContainer from "../images/imageSortContainer";
import S3DragAndDrop from "../images/s3DragAndDrop";
import ImageTextFieldModal from "../images/imageTextFieldModal";
import SaveToast from "../toasts/saveToast";

const MiniForm = ({ mode }) => {
  const [mini, setMini] = useState({ name: "", images: [] });
  const [figureSearch, setFigureSearch] = useState("");
  const [figureResults, setFigureResults] = useState([]);
  const [selectedFigure, setSelectedFigure] = useState();
  const [figureDropdownOpen, setFigureDropdownOpen] = useState(false);
  const [showTextFieldModal, setShowTextFieldModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageObj, setImageObj] = useState({});
  const { token, userId } = useUserData();
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const miniData = await getMini(id);
      setMini(miniData);
      setSelectedFigure(miniData.figure);
    };
    const fetchFigure = async () => {
      const initialFigure = await getFigure(searchParams.get("figure"));
      chooseFigure(initialFigure);
    };
    if (mode === "edit") {
      fetchData();
    } else if (searchParams.get("figure")) {
      fetchFigure();
    }
  }, [mode, id, searchParams]);

  const handleSort = (position1, position2) => {
    const imagesClone = [...mini.images];
    const temp = imagesClone[position1];
    imagesClone[position1] = imagesClone[position2];
    imagesClone[position2] = temp;
    setMini({ ...mini, images: imagesClone });
  };

  const handleDelete = (index) => {
    const imagesClone = mini.images;
    const removedImages = imagesClone.splice(index, 1);

    const newMiniObject = { ...mini, images: imagesClone };
    if (removedImages[0]?._id === mini.thumbnail._id) {
      newMiniObject.thumbnail = imagesClone[0];
    }

    setMini(newMiniObject);
  };

  const handleSetThumbnail = (id) => {
    setMini((prevMini) => ({ ...prevMini, thumbnail: id }));
  };

  const handleSubmit = async (e) => {
    let miniData;
    e.preventDefault();
    if (mode === "edit") {
      miniData = await putMini(mini._id, {
        ...mini,
        figure: selectedFigure,
      });
    } else if (mode === "new") {
      miniData = await postMini({
        ...mini,
        figure: selectedFigure,
      });
    }
    if (miniData) {
      toast(SaveToast, {
        data: {
          message: `${mini.name} Saved.`,
        },
      });
      navigate(`/minis/${id || miniData?._id || ""}`);
    }
  };

  const addImages = async (newImages) => {
    let images = mini.images;
    images = [...images, ...newImages];
    setMini((prevMini) => ({
      ...prevMini,
      images,
      thumbnail: prevMini.thumbnail || images[0],
    }));
  };

  const handleNameChange = (e) => {
    e.preventDefault();
    setMini((prevMini) => ({ ...prevMini, name: e.target.value }));
  };

  const handleDescriptionChange = (e) => {
    e.preventDefault();
    setMini((prevMini) => ({ ...prevMini, description: e.target.value }));
  };

  const handleBlur = () => {
    setMini((prevMini) => ({ ...prevMini, blur: !prevMini.blur }));
  };

  const chooseFigure = (figure) => {
    setSelectedFigure(figure);
    setFigureSearch(figure?.name || "");
    setFigureDropdownOpen(false);
  };

  const handleFigureSearchChange = async (e) => {
    e.preventDefault();
    setFigureSearch(e.target.value);
    const results = await getFiguresBySearch(e.target.value, {
      limit: 20,
      offset: 0,
    });
    const figures = results.docs;
    setFigureDropdownOpen(true);
    setFigureResults(figures);
  };

  const handleFigureSearchBlur = (e) => {
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      setFigureDropdownOpen(false);
    }
  };

  const handleImageSave = async () => {
    const imagesClone = [...mini.images];
    imagesClone[selectedImageIndex] = imageObj;
    setMini({ ...mini, images: imagesClone });
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
    setImageObj(mini?.images[index]);

    setShowTextFieldModal(true);
  };

  return (
    <>
      {mini && token && (userId === mini?.userId?._id || mode === "new") && (
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
                value={mini.name}
                onChange={handleNameChange}
              />
            </div>

            <div className="block max-w-lg">
              <Label htmlFor="description1">Description</Label>
              <Textarea
                id="description1"
                rows={4}
                onChange={handleDescriptionChange}
                value={mini.description}
              />
            </div>

            <div className="max-w-lg">
              <Label htmlFor="figure1">Figure</Label>
              {selectedFigure ? (
                <div className="ml-4 py-2 dark:text-white">
                  {selectedFigure.name}{" "}
                  <span className="text-gray-700 dark:text-gray-500">
                    {selectedFigure.partNumber}
                  </span>
                </div>
              ) : (
                <div className="ml-4 py-2 dark:text-gray-500 text-gray-700">
                  None
                </div>
              )}

              <AutoCompleteInput
                chooseItem={chooseFigure}
                dropdownOpen={figureDropdownOpen}
                setDropdownOpen={setFigureDropdownOpen}
                onChange={handleFigureSearchChange}
                onFocus={handleFigureSearchChange}
                value={figureSearch}
                items={figureResults}
                onBlur={handleFigureSearchBlur}
              />
            </div>

            <div className="flex flex-col gap-5">
              <div className="max-w-lg">
                <Label htmlFor="images1">Images</Label>
                <S3DragAndDrop addImages={addImages} />
              </div>
              <div className="">
                <ImageSortContainer
                  onSort={handleSort}
                  onDelete={handleDelete}
                  images={mini.images}
                  onSetThumbnail={handleSetThumbnail}
                  onEdit={handleImageEdit}
                  thumbnail={mini.thumbnail}
                />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Checkbox id="blur1" checked={mini.blur} onChange={handleBlur} />
              <Label htmlFor="blur1">Blur (for NSFW/Content Warning)</Label>
            </div>

            <div className="max-w-lg">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      )}
      {!token && (
        <Button as={Link} to={`/login`}>
          Login?
        </Button>
      )}
    </>
  );
};

export default MiniForm;
