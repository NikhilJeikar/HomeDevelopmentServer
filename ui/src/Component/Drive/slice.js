import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readCookies } from "../../utils";

const initialState = {
  current_path: "",
  list: [],
  need_update: true,
  path_list: [],
  send_list: [],
  authorized: true,
};

export const file_list = createAsyncThunk(
  "drive/file-list",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    const queryParameters = new URLSearchParams(window.location.search);
    const shareToken = queryParameters.get("share");
    var response = await fetch(
      shareToken === null ? "/api/drive/file-list" : "/api/drive/share/file-list",
      {
        method: "POST",
        headers:
          shareToken === null
            ? {
                Accept: "application/json",
                "Content-Type": "application/json",
                user: username,
                session: session_id,
              }
            : {
                Accept: "application/json",
                "Content-Type": "application/json",
                user: username,
                session: session_id,
                share: shareToken,
              },
        body: JSON.stringify({
          current_path: params.current_path,
        }),
      }
    );
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return {
      failed: false,
      list: json.list,
      path: json.dir,
      dir_list: json.dir_list,
    };
  }
);

export const create_file = createAsyncThunk(
  "drive/create-file",
  async (params, thunkAPI) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const shareToken = queryParameters.get("share");
    var { username, session_id } = readCookies();
    var response = await fetch(
      shareToken === null ? "/api/drive/create-file" : "/api/drive/share/create-file",
      {
        method: "POST",
        headers:
          shareToken === null
            ? {
                Accept: "application/json",
                "Content-Type": "application/json",
                user: username,
                session: session_id,
              }
            : {
                Accept: "application/json",
                "Content-Type": "application/json",
                user: username,
                session: session_id,
                share: shareToken,
              },
        body: JSON.stringify({
          current_path: params.current_path,
          name: params.name,
          dir: false,
        }),
      }
    );
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return { failed: false, response: json };
  }
);

export const create_folder = createAsyncThunk(
  "drive/create-folder",
  async (params, thunkAPI) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const shareToken = queryParameters.get("share");
    var { username, session_id } = readCookies();
    var response = await fetch(
      shareToken === null ? "/api/drive/create-folder" : "/api/drive/share/create-folder",
      {
        method: "POST",
        headers:
          shareToken === null
            ? {
                Accept: "application/json",
                "Content-Type": "application/json",
                user: username,
                session: session_id,
              }
            : {
                Accept: "application/json",
                "Content-Type": "application/json",
                user: username,
                session: session_id,
                share: shareToken,
              },
        body: JSON.stringify({
          name: params.name,
          current_path: params.current_path,
          dir: true,
        }),
      }
    );
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return { failed: false, response: json };
  }
);

export const change_folder = createAsyncThunk(
  "drive/change-folder",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    const queryParameters = new URLSearchParams(window.location.search);
    const shareToken = queryParameters.get("share");
    var response = await fetch(
      shareToken === null ? "/api/drive/change-folder" : "/api/drive/share/change-folder",
      {
        method: "POST",
        headers:
          shareToken === null
            ? {
                Accept: "application/json",
                "Content-Type": "application/json",
                user: username,
                session: session_id,
              }
            : {
                Accept: "application/json",
                "Content-Type": "application/json",
                user: username,
                session: session_id,
                share: shareToken,
              },
        body: JSON.stringify({
          current_path: params.current_path,
          name: params.name,
        }),
      }
    );
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return {
      failed: false,
      path: json.dir,
      dir_list: json.dir_list,
    };
  }
);

export const upload_file = createAsyncThunk(
  "drive/upload-file",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    const queryParameters = new URLSearchParams(window.location.search);
    const shareToken = queryParameters.get("share");
    const func = async (file, path) => {
      let data = new FormData();
      data.append("files", file, file.name);
      var response = await fetch(
        shareToken === null
          ? `/api/drive/upload-file?path=${path.toString()}`
          : `/api/drive/share/upload-file?path=${path.toString()}`,
        {
          method: "POST",
          headers:
            shareToken === null
              ? {
                  user: username,
                  session: session_id,
                }
              : {
                  user: username,
                  session: session_id,
                  share: shareToken,
                },
          body: data,
        }
      );
      var json = await response.json();
      var status = await response.status;
      if (status !== 200) {
        return thunkAPI.rejectWithValue(status);
      }
      return {
        failed: false,
        list: json.list,
        path: json.dir,
        dir_list: json.dir_list,
      };
    };
    for (var i = 0; i < params.file.length; i++) {
      await func(params.file[i], params.path);
    }
  }
);

export const download_file = createAsyncThunk(
  "drive/download-file",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    const queryParameters = new URLSearchParams(window.location.search);
    const shareToken = queryParameters.get("share");
    fetch(
      shareToken === null
        ? `/api/drive/download-file?current_path=${params.current_path}&name=${params.name}`
        : `/api/drive/share/download-file?current_path=${params.current_path}&name=${params.name}`,
      {
        headers:
          shareToken === null
            ? {
                user: username,
                session: session_id,
              }
            : {
                user: username,
                session: session_id,
                share: shareToken,
              },
      }
    )
      .then((res) => res.blob())
      .then((res) => {
        const aElement = document.createElement("a");
        aElement.setAttribute("download", params.name);
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute("target", "_blank");
        aElement.click();
        URL.revokeObjectURL(href);
      })
      .catch((error) => console.error("Error during fetch operation:", error));
  }
);

export const download_folder = createAsyncThunk(
  "drive/download-folder",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    const queryParameters = new URLSearchParams(window.location.search);
    const shareToken = queryParameters.get("share");
    fetch(
      shareToken === null
        ? `/api/drive/download-folder?current_path=${params.current_path}&name=${params.name}`
        : `/api/drive/share/download-folder?current_path=${params.current_path}&name=${params.name}`,
      {
        headers:
          shareToken === null
            ? {
                user: username,
                session: session_id,
              }
            : {
                user: username,
                session: session_id,
                share: shareToken,
              },
      }
    )
      .then((res) => res.blob())
      .then((res) => {
        const aElement = document.createElement("a");
        aElement.setAttribute("download", params.name + ".zip");
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute("target", "_blank");
        aElement.click();
        URL.revokeObjectURL(href);
      })
      .catch((error) => console.error("Error during fetch operation:", error));
  }
);

export const delete_file = createAsyncThunk(
  "drive/delete-file",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    const queryParameters = new URLSearchParams(window.location.search);
    const shareToken = queryParameters.get("share");
    var response = await fetch(
      shareToken === null
        ? `/api/drive/delete-file?current_path=${params.current_path}&name=${params.name}`
        : `/api/drive/share/delete-file?current_path=${params.current_path}&name=${params.name}`,
      {
        headers:
          shareToken === null
            ? {
                user: username,
                session: session_id,
              }
            : {
                user: username,
                session: session_id,
                share: shareToken,
              },
      }
    );
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return { failed: false, response: json };
  }
);

export const delete_folder = createAsyncThunk(
  "drive/delete-folder",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    const queryParameters = new URLSearchParams(window.location.search);
    const shareToken = queryParameters.get("share");
    var response = await fetch(
      shareToken === null
        ? `/api/drive/delete-folder?current_path=${params.current_path}&name=${params.name}`
        : `/api/drive/share/delete-folder?current_path=${params.current_path}&name=${params.name}`,
      {
        headers:
          shareToken === null
            ? {
                user: username,
                session: session_id,
              }
            : {
                user: username,
                session: session_id,
                share: shareToken,
              },
      }
    );
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return { failed: false, response: json };
  }
);

export const rename_file = createAsyncThunk(
  "drive/rename-file",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    const queryParameters = new URLSearchParams(window.location.search);
    const shareToken = queryParameters.get("share");
    var response = await fetch(
      shareToken === null
        ? `/api/drive/rename-file?current_path=${params.current_path}&name=${params.name}&prev_name=${params.prev_name}`
        : `/api/drive/share/rename-file?current_path=${params.current_path}&name=${params.name}&prev_name=${params.prev_name}`,
      {
        headers:
          shareToken === null
            ? {
                user: username,
                session: session_id,
              }
            : {
                user: username,
                session: session_id,
                share: shareToken,
              },
      }
    );
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return { failed: false, response: json };
  }
);

export const rename_folder = createAsyncThunk(
  "drive/rename-folder",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    const queryParameters = new URLSearchParams(window.location.search);
    const shareToken = queryParameters.get("share");
    var response = await fetch(
      shareToken === null
        ? `/api/drive/rename-folder?current_path=${params.current_path}&name=${params.name}&prev_name=${params.prev_name}`
        : `/api/drive/share/rename-folder?current_path=${params.current_path}&name=${params.name}&prev_name=${params.prev_name}`,
      {
        headers:
          shareToken === null
            ? {
                user: username,
                session: session_id,
              }
            : {
                user: username,
                session: session_id,
                share: shareToken,
              },
      }
    );
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return { failed: false, response: json };
  }
);

export const create_share = createAsyncThunk(
  "drive/share",
  async (params, thunkAPI) => {
    console.log(params);
    var { username, session_id } = readCookies();
    var response = await fetch("/api/drive/share", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        user: username,
        session: session_id,
      },
      body: JSON.stringify({
        path: params.path,
        linkParam: params.linkParam,
        read: params.read,
        edit: !params.read,
        close_time: params.close_time,
      }),
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return thunkAPI.rejectWithValue(status);
    }
    return {
      failed: false,
      share_token: json.shared,
    };
  }
);

export const drive = createSlice({
  name: "drive",
  initialState: initialState,
  reducers: {
    setCurrentPath: (state, action) => {
      const { path } = action.payload;
      state.current_path = path;
    },
    clearState: (state, action) => {
      state.current_path = "";
      state.list = [];
      state.need_update = true;
      state.path_list = [];
      state.send_list = [];
      state.authorized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(file_list.fulfilled, (state, action) => {
        state.list = action.payload.list;
        state.current_path = action.payload.path;
        state.path_list = action.payload.dir_list;
        state.need_update = false;
      })
      .addCase(file_list.pending, (state, action) => {
        state.need_update = false;
      })
      .addCase(file_list.rejected, (state, action) => {
        state.need_update = false;
        if (action.payload === 401) {
          state.authorized = false;
        }
      })
      .addCase(create_file.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(create_file.pending, (state, action) => {})
      .addCase(create_file.rejected, (state, action) => {
        if (action.payload === 401) {
          state.authorized = false;
        }
      })
      .addCase(create_folder.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(create_folder.pending, (state, action) => {})
      .addCase(create_folder.rejected, (state, action) => {
        if (action.payload === 401) {
          state.authorized = false;
        }
      })
      .addCase(change_folder.fulfilled, (state, action) => {
        state.current_path = action.payload.path;
        state.need_update = true;
        state.path_list = action.payload.dir_list;
      })
      .addCase(change_folder.pending, (state, action) => {})
      .addCase(change_folder.rejected, (state, action) => {
        if (action.payload === 401) {
          state.authorized = false;
        }
      })
      .addCase(upload_file.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(upload_file.pending, (state, action) => {})
      .addCase(upload_file.rejected, (state, action) => {
        state.need_update = true;
        if (action.payload === 401) {
          state.authorized = false;
        }
      })
      .addCase(download_file.fulfilled, (state, action) => {})
      .addCase(download_file.pending, (state, action) => {})
      .addCase(download_file.rejected, (state, action) => {
        if (action.payload === 401) {
          state.authorized = false;
        }
      })
      .addCase(download_folder.fulfilled, (state, action) => {})
      .addCase(download_folder.pending, (state, action) => {})
      .addCase(download_folder.rejected, (state, action) => {
        if (action.payload === 401) {
          state.authorized = false;
        }
      })
      .addCase(delete_file.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(delete_file.pending, (state, action) => {})
      .addCase(delete_file.rejected, (state, action) => {
        state.need_update = true;
        if (action.payload === 401) {
          state.authorized = false;
        }
      })
      .addCase(delete_folder.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(delete_folder.pending, (state, action) => {})
      .addCase(delete_folder.rejected, (state, action) => {
        state.need_update = true;
        if (action.payload === 401) {
          state.authorized = false;
        }
      })
      .addCase(rename_file.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(rename_file.pending, (state, action) => {})
      .addCase(rename_file.rejected, (state, action) => {
        state.need_update = true;
        if (action.payload === 401) {
          state.authorized = false;
        }
      })
      .addCase(rename_folder.fulfilled, (state, action) => {
        state.need_update = true;
      })
      .addCase(rename_folder.pending, (state, action) => {})
      .addCase(rename_folder.rejected, (state, action) => {
        state.need_update = true;
        if (action.payload === 401) {
          state.authorized = false;
        }
      })
      .addCase(create_share.fulfilled, (state, action) => {})
      .addCase(create_share.pending, (state, action) => {})
      .addCase(create_share.rejected, (state, action) => {
        if (action.payload === 401) {
          state.authorized = false;
        }
      });
  },
});

export const { clearState } = drive.actions;
export default drive.reducer;
