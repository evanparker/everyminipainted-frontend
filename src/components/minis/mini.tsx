import { Button } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import {
  FaFlag,
  FaHeart,
  FaPencil,
  FaRegHeart,
  FaTrashCan,
} from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify/unstyled";
import { deleteMini, getMini } from "../../services/mini";
import { postModerationReport } from "../../services/moderationReport";
import { addFavorite, removeFavorite } from "../../services/user";
import UserContext from "../../userContext";
import DeleteModal from "../deleteModal";
import HeadTags from "../headTags";
import ModerationReportModal from "../moderationReportModal";
import DeleteToast from "../toasts/deleteToast";
import ModerationReportToast from "../toasts/moderationReportToast";
import UserAvatar from "../users/userAvatar";
import DisplayMini from "./displayMini";
import type { Mini } from "../../types/mini.types";
import { ModerationReason } from "../../types/moderationReport.types";

const Mini = () => {
  const navigate = useNavigate();
  const [mini, setMini] = useState<Mini | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModerationReportModal, setShowModerationReportModal] =
    useState(false);
  const [favorited, setFavorited] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const miniData = await getMini(id);
        setMini(miniData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e && e.status === 404) {
          navigate("/404", { replace: true });
        }
      }
    };
    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    if (id && user?.favorites[id]) {
      setFavorited(true);
    }
  }, [id, user]);

  const handleDeleteMini = async () => {
    const deletedMini = await deleteMini(id);
    if (deletedMini) {
      toast(DeleteToast, {
        data: { message: `${mini?.name} Deleted` },
      });
      navigate("/");
    }
  };

  const handleModerationReport = async (data: {
    reason: ModerationReason;
    description: string;
  }) => {
    if (!mini) return;
    postModerationReport({ mini: mini, ...data });
    toast(ModerationReportToast, {});
  };

  const favorite = async () => {
    if (!mini) return;
    try {
      if (favorited) {
        const updatedUser = await removeFavorite(id);
        setFavorited(false);
        setUser((prevUser) =>
          prevUser
            ? { ...prevUser, favorites: updatedUser.favorites }
            : undefined,
        );
        if (mini) {
          setMini({ ...mini, favorites: mini.favorites - 1 });
        }
      } else {
        const updatedUser = await addFavorite(id);
        setFavorited(true);
        setUser((prevUser) =>
          prevUser
            ? { ...prevUser, favorites: updatedUser.favorites }
            : undefined,
        );
        if (mini) {
          setMini({ ...mini, favorites: mini.favorites + 1 });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {mini && (
        <HeadTags
          name={mini.name}
          description={mini.description}
          thumbnail={mini.images[0]}
        />
      )}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteMini}
      />
      <ModerationReportModal
        show={showModerationReportModal}
        onClose={() => setShowModerationReportModal(false)}
        onConfirm={handleModerationReport}
      />

      {mini && <DisplayMini mini={mini} />}

      {mini && (
        <div className="flex gap-5 mt-5">
          <Button className="max-w-36" disabled={!user} onClick={favorite}>
            {favorited ? (
              <FaHeart className="mr-2 h-5 w-5" />
            ) : (
              <FaRegHeart className="mr-2 h-5 w-5" />
            )}
            <span>{mini.favorites}</span>
          </Button>
          {user && (
            <Button
              className="max-w-36"
              disabled={!user}
              color="red"
              onClick={() => setShowModerationReportModal(true)}
            >
              <FaFlag className="mr-2 h-5 w-5" /> Report
            </Button>
          )}
        </div>
      )}

      {mini?.userId && (
        <div className="mt-5 w-xs">
          <UserAvatar user={mini?.userId} />
        </div>
      )}
      <div className="flex gap-5">
        {user && user?._id === mini?.userId._id && (
          <Button
            className="max-w-36 mt-5"
            as={Link}
            to={"/minis/" + id + "/edit"}
          >
            <FaPencil className="mr-2 h-5 w-5" />
            Edit
          </Button>
        )}
        {user && user?._id === mini?.userId._id && (
          <Button
            color="red"
            className="max-w-36 mt-5"
            onClick={() => setShowDeleteModal(true)}
          >
            <FaTrashCan className="mr-2 h-5 w-5" /> Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default Mini;
