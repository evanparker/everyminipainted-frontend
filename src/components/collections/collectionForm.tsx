import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCollection,
  postCollection,
  putCollection,
} from "../../services/collection";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import ImageSortContainer from "../images/imageSortContainer";
import { getManufacturersBySearch } from "../../services/manufacturer";
import { toast } from "react-toastify/unstyled";
import SaveToast from "../toasts/saveToast";
import S3DragAndDrop from "../images/s3DragAndDrop";
import UserContext from "../../userContext";
import toBool from "../../util/toBool";
import AutoCompleteInput from "../autoCompleteInput";
import { getFiguresBySearch } from "../../services/figure";
import { FaTrashCan } from "react-icons/fa6";
import ImageTextFieldModal from "../images/imageTextFieldModal";
import { putImage } from "../../services/image";
import { Manufacturer } from "../../types/manufacturer.types";
import Collection from "./collection";
import { Image } from "../../types/image.types";
import Figure from "../figures/figure";

const CollectionForm = ({ mode }: { mode: "new" | "edit" }) => {
  const { user } = useContext(UserContext);
  const [collection, setCollection] = useState<Collection | undefined>();
  const [canEdit, setCanEdit] = useState(false);
  const [manufacturerSearch, setManufacturerSearch] = useState("");
  const [manufacturerResults, setManufacturerResults] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    Manufacturer | undefined
  >();
  const [manufacturerDropdownOpen, setManufacturerDropdownOpen] =
    useState(false);

  const [figureSearch, setFigureSearch] = useState("");
  const [figureResults, setFigureResults] = useState([]);
  const [figureDropdownOpen, setFigureDropdownOpen] = useState(false);

  const [showTextFieldModal, setShowTextFieldModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageObj, setImageObj] = useState<Image | undefined>();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollectionData = async () => {
      const collectionData = await getCollection(id);
      setSelectedManufacturer(collectionData.manufacturer);
      setCollection({
        name: "",
        partNumber: "",
        website: "",
        description: "",
        images: [],
        figures: [],
        ...collectionData,
      });
    };

    if (mode === "edit") {
      fetchCollectionData();
    } else {
      setCollection({
        name: "",
        partNumber: "",
        website: "",
        description: "",
        images: [],
        figures: [],
      });
    }
  }, [mode, id]);

  useEffect(() => {
    if (
      (import.meta.env.VITE_EDIT_COLLECTION_REQUIRES_ADMIN !== undefined &&
        toBool(import.meta.env.VITE_EDIT_COLLECTION_REQUIRES_ADMIN) ===
          false) ||
      user?.roles?.includes("admin")
    ) {
      setCanEdit(true);
    }
  }, [user]);

  const handleSort = (position1: number, position2: number) => {
    if (!collection) return;
    const imagesClone = [...(collection.images || [])];
    const temp = imagesClone[position1];
    imagesClone[position1] = imagesClone[position2];
    imagesClone[position2] = temp;
    setCollection({ ...collection, images: imagesClone });
  };

  const handleDelete = (index: number) => {
    if (!collection) return;
    const imagesClone = collection.images || [];
    const removedImages = imagesClone.splice(index, 1);
    const newCollectionObject = { ...collection, images: imagesClone };
    if (removedImages[0]?._id === collection?.thumbnail?._id) {
      newCollectionObject.thumbnail = imagesClone[0];
    }
    setCollection(newCollectionObject);
  };

  const handleSetThumbnail = (newThumbnail: Image) => {
    setCollection((prevCollection) =>
      prevCollection
        ? { ...prevCollection, thumbnail: newThumbnail }
        : undefined,
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!collection) return;
    let collectionData;
    e.preventDefault();
    if (mode === "edit") {
      collectionData = await putCollection(collection?._id, {
        ...collection,
        manufacturer: selectedManufacturer,
      });
    } else if (mode === "new") {
      collectionData = await postCollection({
        ...collection,
        manufacturer: selectedManufacturer,
      });
    }
    if (collectionData) {
      toast(SaveToast, {
        data: {
          message: `${collection.name} Saved.`,
        },
      });
      navigate(`/collections/${id || collectionData._id || ""}`);
    }
  };

  const addImages = async (newImages: Image[]) => {
    if (!collection) return;
    let images = collection?.images;
    images = [...images, ...newImages];
    setCollection((prevCollection) =>
      prevCollection
        ? {
            ...prevCollection,
            images,
            thumbnail: prevCollection.thumbnail || images[0],
          }
        : undefined,
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCollection((prevCollection) =>
      prevCollection
        ? {
            ...prevCollection,
            name: e.target.value,
          }
        : undefined,
    );
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    e.preventDefault();
    setCollection((prevCollection) =>
      prevCollection
        ? {
            ...prevCollection,
            description: e.target.value,
          }
        : undefined,
    );
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCollection((prevCollection) =>
      prevCollection
        ? {
            ...prevCollection,
            website: e.target.value,
          }
        : undefined,
    );
  };

  const handlePartNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCollection((prevCollection) =>
      prevCollection
        ? {
            ...prevCollection,
            partNumber: e.target.value,
          }
        : undefined,
    );
  };

  const chooseManufacturer = (manufacturer: Manufacturer | undefined) => {
    setSelectedManufacturer(manufacturer);
    setManufacturerSearch(manufacturer?.name || "");
    setManufacturerDropdownOpen(false);
  };

  const handleManufacturerSearchChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    setManufacturerSearch(e.target.value);
    const manufacturers = await getManufacturersBySearch(e.target.value, {
      limit: 20,
      offset: 0,
    });
    setManufacturerDropdownOpen(true);
    setManufacturerResults(manufacturers.docs);
  };

  const handleManufacturerSearchBlur = (
    e: React.FocusEvent | React.KeyboardEvent,
  ) => {
    if (
      !("relatedTarget" in e) ||
      !e.relatedTarget ||
      !e.currentTarget.contains(e.relatedTarget)
    ) {
      setManufacturerDropdownOpen(false);
    }
  };

  const chooseFigure = (figure: Figure | undefined) => {
    if (!collection || !figure) return;
    const figures = collection.figures || [];
    figures.push(figure);
    setCollection({ ...collection, figures });
    setFigureDropdownOpen(false);
  };

  const handleFigureSearchChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    setFigureSearch(e.target.value);
    const options: { limit: number; offset: number; manufacturer?: string } = {
      limit: 20,
      offset: 0,
    };
    if (selectedManufacturer) {
      options.manufacturer = selectedManufacturer._id;
    }
    const results = await getFiguresBySearch(e.target.value, options);
    const figures = results.docs;
    setFigureDropdownOpen(true);
    setFigureResults(figures);
  };

  const handleFigureSearchBlur = (
    e: React.FocusEvent | React.KeyboardEvent,
  ) => {
    if (
      !("relatedTarget" in e) ||
      !e.relatedTarget ||
      !e.currentTarget.contains(e.relatedTarget)
    ) {
      setFigureDropdownOpen(false);
    }
  };

  const handleFigureDelete = (index: number) => {
    if (!collection) return;
    const figures = collection.figures || [];
    figures.splice(index, 1);
    setCollection({ ...collection, figures });
  };

  const handleImageSave = async () => {
    if (!collection || !imageObj) return;
    const imagesClone = [...collection.images];
    imagesClone[selectedImageIndex] = imageObj;
    setCollection({ ...collection, images: imagesClone });
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

  const handleImageEdit = (index: number) => {
    setSelectedImageIndex(index);
    setImageObj(collection?.images[index]);

    setShowTextFieldModal(true);
  };

  return (
    <>
      {collection && canEdit && (
        <div>
          {imageObj && (
            <ImageTextFieldModal
              imageObj={imageObj}
              show={showTextFieldModal}
              onClose={() => setShowTextFieldModal(false)}
              onConfirm={handleImageSave}
              setImageObj={setImageObj}
            />
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="max-w-lg block">
              <Label htmlFor="name1">Name</Label>
              <TextInput
                id="name1"
                type="text"
                value={collection.name}
                onChange={handleNameChange}
                required={true}
              />
            </div>

            <div className="max-w-lg block">
              <Label htmlFor="partNumber1">Part Number</Label>
              <TextInput
                id="partNumber1"
                type="text"
                value={collection.partNumber}
                onChange={handlePartNumberChange}
              />
            </div>

            <div className="max-w-lg block">
              <Label htmlFor="website1">Website</Label>
              <TextInput
                id="website1"
                type="text"
                value={collection.website}
                onChange={handleWebsiteChange}
              />
            </div>

            <div className="max-w-lg block">
              <Label htmlFor="description1">Description</Label>
              <Textarea
                id="description1"
                rows={4}
                onChange={handleDescriptionChange}
                value={collection.description}
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

            <div className="max-w-lg">
              <Label htmlFor="figure1">Figures</Label>
              {collection.figures.map((figure, index) => (
                <div
                  className="p-2 dark:text-white dark:bg-gray-700 bg-gray-200 mb-2 ml-4 rounded-md"
                  key={figure._id}
                >
                  {figure.name}{" "}
                  <span className="text-gray-700 dark:text-gray-500">
                    {figure.partNumber}
                  </span>{" "}
                  <span
                    onClick={() => handleFigureDelete(index)}
                    className="inline-block cursor-pointer text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FaTrashCan />
                  </span>
                </div>
              ))}

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

            <div className="block">
              <div className="max-w-lg">
                <Label htmlFor="images1">Images</Label>
                <S3DragAndDrop addImages={addImages} />
              </div>
              <div className="mt-5">
                <ImageSortContainer
                  onSort={handleSort}
                  onDelete={handleDelete}
                  images={collection.images}
                  onEdit={handleImageEdit}
                  thumbnail={collection.thumbnail}
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

export default CollectionForm;
