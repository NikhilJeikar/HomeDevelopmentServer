import Dialog from "@mui/material/Dialog";
import { Fragment, useEffect, useRef, useState } from "react";
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
  const canvas_named_ref = useRef(null);
  const canvas_unnamed_ref = useRef(null);

  const build_named = () => {
    const canvas_named = canvas_named_ref.current;
    if (canvas_named != null && canvas_named !== undefined) {
      if (path !== null || path !== undefined) {
        const context = canvas_named.getContext("2d");
        const img = new Image();
        img.src = path;
        img.onload = () => {
          context.drawImage(img, 0, 0, details.width, details.height);
          context.strokeStyle = "white";
          context.lineWidth = 2;
          context.beginPath();
          details.faces.map((value, index) => {
            if(face_name_map[value.id] != null){
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
          });
        };
      }
    }
  };

  const build_unnamed = () => {
    const canvas_unnamed = canvas_unnamed_ref.current;
    if (canvas_unnamed != null && canvas_unnamed !== undefined) {
      if (path !== null || path !== undefined) {
        const context = canvas_unnamed.getContext("2d");
        const img = new Image();
        img.src = path;
        img.onload = () => {
          context.drawImage(img, 0, 0, details.width, details.height);
        };
      }
    }
  };

  useEffect(() => {
    build_named();
    build_unnamed();
  });

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
        {hover ? (
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
