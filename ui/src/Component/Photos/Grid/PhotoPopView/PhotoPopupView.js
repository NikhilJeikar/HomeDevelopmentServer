import { Box, CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { Fragment, useCallback, useState } from "react";
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
  const canvas_named_ref = useCallback(
    (canvas_named) => {
      if (canvas_named != null && canvas_named !== undefined) {
        if (path !== null && path !== undefined) {
          const context = canvas_named.getContext("2d");
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
          };
        }
      }
    },
    [details.faces, details.height, details.width, face_name_map, path]
  );
  const canvas_unnamed_ref = useCallback(
    (canvas_unnamed) => {
      if (canvas_unnamed != null && canvas_unnamed !== undefined) {
        if (path !== null && path !== undefined) {
          const context = canvas_unnamed.getContext("2d");
          const img = new Image();
          img.src = path;
          img.onload = () => {
            context.drawImage(img, 0, 0, details.width, details.height);
          };
        }
      }
    },
    [details.height, details.width, path]
  );

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
        {path === null || path === undefined ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : hover ? (
          <canvas
            ref={canvas_named_ref}
            height={details.height}
            width={details.width}
            style={{ width: "100%" }}
            onMouseEnter={() => {
              setOnHover(true);
            }}
            onMouseLeave={() => {
              setOnHover(false);
            }}
          />
        ) : (
          <canvas
            ref={canvas_unnamed_ref}
            height={details.height}
            width={details.width}
            style={{ width: "100%" }}
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
