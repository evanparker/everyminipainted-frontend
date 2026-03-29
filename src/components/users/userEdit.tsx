import Croppie from "croppie";
import "croppie/croppie.css";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify/unstyled";
import { postImage } from "../../services/image";
import { putUser } from "../../services/user";
import UserContext from "../../userContext";
import getS3Url from "../images/getS3Url";
import S3DragAndDrop from "../images/s3DragAndDrop";
import SocialsForm from "../socialsForm";
import SaveToast from "../toasts/saveToast";
import UserAvatar from "./userAvatar";
import { User } from "../../types/user.types";
import { Social } from "../../types/social.types";
import { ImageS3 } from "../../types/image.types";

const UserEdit = () => {
  const { user: userFromContext, setUser: setUserFromContext } =
    useContext(UserContext);
  const [user, setUser] = useState<User | undefined>(undefined);
  const navigate = useNavigate();
  const [socials, setSocials] = useState<Social[]>([]);
  const [croppie, setCroppie] = useState<Croppie | null>(null);
  const [croppieImage, setCroppieImage] = useState("");
  const abortControllerRef = useRef(new AbortController());

  useEffect(() => {
    setUser(userFromContext);
    setSocials(userFromContext?.socials || []);
  }, [userFromContext]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const responseData = await putUser(user._id, { ...user, socials });
    if (responseData) {
      setUserFromContext({ ...user, socials });
      toast(SaveToast, { data: { message: `${user.username} Saved.` } });
      navigate(`/users/${user.username}`);
    }
  };

  const addImages = async (newImages: ImageS3[]) => {
    const newImage = newImages[0];
    const url = getS3Url({
      key: newImage.s3Key,
      bucket: newImage.s3Bucket,
      options: "width:800",
      extension: "png",
    });
    setCroppieImage(url);
    const el = document.getElementById("croppie-image-helper");
    if (el) {
      const croppieInstance = new Croppie(el, {
        enableExif: true,
        viewport: {
          height: 200,
          width: 200,
          type: "circle",
        },
        boundary: {
          height: 300,
          width: 300,
        },
        mouseWheelZoom: false,
      });
      croppieInstance.bind({
        url: url,
      });
      setCroppie(croppieInstance);
    }
  };

  const handleCropButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (croppie !== null) {
      croppie
        .result({
          type: "blob",
          size: {
            width: 480,
            height: 480,
          },
        })
        .then(async (blob) => {
          // Save image to backend
          const file = new File([blob], "image.png", {
            type: "image/png",
            lastModified: new Date().getTime(),
          });

          abortControllerRef.current.abort();
          abortControllerRef.current = new AbortController();
          try {
            const image = await postImage(
              file,
              abortControllerRef.current.signal,
            );

            setUser((prevUser) =>
              prevUser ? { ...prevUser, avatar: image } : undefined,
            );
            setCroppieImage("");
            croppie.destroy();
          } catch (error) {
            if ((error as Error).name !== "AbortError") {
              console.error(error);
            }
          }
        });
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    e.preventDefault();
    setUser((prevUser) =>
      prevUser
        ? {
            ...prevUser,
            description: e.target.value,
          }
        : undefined,
    );
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUser((prevUser) =>
      prevUser
        ? {
            ...prevUser,
            website: e.target.value,
          }
        : undefined,
    );
  };

  return (
    <>
      {user && (
        <>
          <div className="w-xs mb-5">
            <UserAvatar user={user} isLink={false} />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="block max-w-lg">
              <Label htmlFor="description1">Description</Label>
              <Textarea
                id="description1"
                rows={4}
                onChange={handleDescriptionChange}
                value={user.description}
              />
            </div>

            <div className="max-w-lg">
              <Label htmlFor="website1">Website</Label>
              <TextInput
                id="website1"
                type="text"
                onChange={handleWebsiteChange}
                value={user?.website}
              />
            </div>

            <div className="max-w-lg">
              <SocialsForm socials={socials} setSocials={setSocials} />
            </div>

            <div className="max-w-lg">
              <Label htmlFor="images1">Profile Image</Label>
              <div className="flex gap-3">
                <div className="grow">
                  <S3DragAndDrop addImages={addImages} />
                </div>
                <div className="h-16 w-20 mb-3">
                  <UserAvatar user={user} isLink={false} showText={false} />
                </div>
              </div>
              <div
                className={
                  croppieImage
                    ? "mt-3 flex flex-col gap-5 rounded-lg border-2 border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 p-5"
                    : ""
                }
              >
                <div id="croppie-image-helper" />
                {croppieImage && (
                  <Button
                    className="w-40 self-center"
                    onClick={handleCropButton}
                  >
                    Crop
                  </Button>
                )}
              </div>
            </div>
            <div className="max-w-lg">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default UserEdit;
