import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readCookies } from "../../utils";

const initialState = {
  photo_list: [],
  face_list: [],
  face_name_map:{},
  face_blob_list: {},
  thumbnail_blob_list: {},
  picture_blob_list: {},
};

export const fetch_faces = createAsyncThunk(
  "photo/fetch_faces",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch("/api/photos/face/details?size=25&page=0", {
      method: "GET",
      headers: {
        user: username,
        session: session_id,
      },
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return { failed: true };
    }

    return {
      failed: false,
      data: json,
    };
  }
);

export const fetch_image_details = createAsyncThunk(
  "photo/fetch_image_details",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch("/api/photos/details?size=25&page=0", {
      method: "GET",
      headers: {
        user: username,
        session: session_id,
      },
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return { failed: true };
    }

    return {
      failed: false,
      data: json,
    };
  }
);

export const fetch_thumbnail_image = createAsyncThunk(
  "photo/fetch_thumbnail_image",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch(`/api/photos/thumbnail?path=${params}`, {
      method: "GET",
      headers: {
        user: username,
        session: session_id,
      },
    });
    var blob = await response.blob();
    var status = await response.status;
    if (status !== 200) {
      return null;
    }
    const objectURL = URL.createObjectURL(blob);
    return { path: params, url: objectURL };
  }
);

export const fetch_image = createAsyncThunk(
  "photo/fetch_image",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch(`/api/photos/photo?path=${params}`, {
      method: "GET",
      headers: {
        user: username,
        session: session_id,
      },
    });
    var blob = await response.blob();
    var status = await response.status;
    if (status !== 200) {
      return null;
    }
    const objectURL = URL.createObjectURL(blob);
    return { path: params, url: objectURL };
  }
);

export const fetch_face = createAsyncThunk(
  "photo/fetch_face",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch(`/api/photos/face?path=${params.path}&x1=${params.x1}&x2=${params.x2}&y1=${params.y1}&y2=${params.y2}`, {
      method: "GET",
      headers: {
        user: username,
        session: session_id,
      },
    });
    var blob = await response.blob();
    var status = await response.status;
    if (status !== 200) {
      return null;
    }
    const objectURL = URL.createObjectURL(blob);
    return { path: params.id, url: objectURL };
  }
);

export const update_face_name = createAsyncThunk(
  "photo/update_face_name",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch('/api/photos/face/rename', {
      method: "POST",
      headers: {
        user: username,
        session: session_id,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        id:params.id,
        name:params.name
      })
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return null;
    }
    return json;
  }
);


export const photo = createSlice({
  name: "photo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetch_faces.fulfilled, (state, action) => {
        state.face_list = action.payload.data
        action.payload.data.map((value,index)=>{
          state.face_name_map[value.id] = value.name
        })

      })
      .addCase(fetch_faces.pending, (state, action) => {})
      .addCase(fetch_faces.rejected, (state, action) => {})
      .addCase(fetch_image_details.fulfilled, (state, action) => {
        state.photo_list = action.payload.data;
      })
      .addCase(fetch_image_details.pending, (state, action) => {})
      .addCase(fetch_image_details.rejected, (state, action) => {})
      .addCase(fetch_thumbnail_image.fulfilled, (state, action) => {
        state.thumbnail_blob_list[action.payload.path] = action.payload.url;
      })
      .addCase(fetch_thumbnail_image.pending, (state, action) => {})
      .addCase(fetch_thumbnail_image.rejected, (state, action) => {})
      .addCase(fetch_image.fulfilled, (state, action) => {
        state.picture_blob_list[action.payload.path] = action.payload.url;
      })
      .addCase(fetch_image.pending, (state, action) => {})
      .addCase(fetch_image.rejected, (state, action) => {})
      .addCase(fetch_face.fulfilled, (state, action) => {
        state.face_blob_list[action.payload.path] = action.payload.url;
      })
      .addCase(fetch_face.pending, (state, action) => {})
      .addCase(fetch_face.rejected, (state, action) => {})
      .addCase(update_face_name.fulfilled, (state, action) => {})
      .addCase(update_face_name.pending, (state, action) => {})
      .addCase(update_face_name.rejected, (state, action) => {});
  },
});
