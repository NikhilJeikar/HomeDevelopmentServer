import { Box, CardMedia, CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const PhotoPopupView = ({
  path,
  open,
  handleClose,
  transition,
  details,
  onPrev,
  onNext,
  name,
}) => {
  const { face_name_map } = useSelector((state) => state.photo);
  const [hover, setOnHover] = useState(false);
  const [url_named, setURLNamed] = useState(null);
  const [url_unnamed, setURLUnnamed] = useState(null);

  useEffect(() => {
    setURLNamed(null);
    setURLUnnamed(null);
  }, [path]);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = details.width;
    canvas.height = details.height;
    if (path !== null && path !== undefined) {
      const context = canvas.getContext("2d");
      const img = new Image();
      img.src = path;
      img.onload = () => {
        context.drawImage(img, 0, 0, details.width, details.height);
        context.strokeStyle = "white";
        context.lineWidth = 2;
        context.beginPath();
        details.faces.map((value, index) => {
          if (face_name_map[value.id] != null) {
            context.rect(
              value.face_x1,
              value.face_y1,
              value.face_x2 - value.face_x1,
              value.face_y2 - value.face_y1
            );
            context.font = "30px Arial";
            context.strokeText(
              face_name_map[value.id],
              value.face_x1,
              value.face_y1 + 30
            );
            context.stroke();
          }
          return null;
        });
        canvas.toBlob(function (blob) {
          setURLNamed(URL.createObjectURL(blob));
        }, "image/png");
      };
    }
  }, [details, face_name_map, path]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = details.width;
    canvas.height = details.height;
    if (path !== null && path !== undefined) {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        canvas
          .getContext("2d")
          .drawImage(img, 0, 0, details.width, details.height);
        canvas.toBlob(function (blob) {
          setURLUnnamed(URL.createObjectURL(blob));
        }, "image/png");
      };
    }
  }, [details.height, details.width, path]);

  return (
    <Fragment>
      <Dialog
        autoFocus
        open={open}
        TransitionComponent={transition}
        onClose={handleClose}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            onPrev();
          }
          if (e.key === "ArrowRight") {
            onNext();
          }
        }}
      >
        {url_named === null && url_unnamed === null ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : (
          <CardMedia
            component={"img"}
            src={hover ? url_named : url_unnamed}
            style={{ objectFit: "contain" }}
            onMouseEnter={() => {
              setOnHover(true);
            }}
            onMouseLeave={() => {
              setOnHover(false);
            }}
          />
        )}
      </Dialog>
    </Fragment>
  );
};
