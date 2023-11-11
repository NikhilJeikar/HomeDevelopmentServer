import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  session_id: null,
  loading: false,
  loaded: false,
  error: false,
};

export const login = createAsyncThunk(
  "user/login",
  async (params, thunkAPI) => {
    var response = await fetch("/user/login_user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: params.username,
        password: params.password,
      }),
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return { failed: true };
    }
    return {
      failed: false,
      session_id: json.session_id,
      username: params.username,
    };
  }
);

export const authorize = createAsyncThunk(
  "user/authorize",
  async (params, thunkAPI) => {
    var response = await fetch("/user/authorize", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: params.username,
        session_id: params.session_id,
      }),
    });
    var json = await response.json();
    var status = await response.status;
    if (status !== 200) {
      return { failed: true };
    }
    if (json.status) {
      return { failed: false, session_id: params.session_id };
    } else {
      return { session_id: null };
    }
  }
);

export const user = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setToken: (state, action) => {
      const { username, session_id } = action.payload;
      state.username = username;
      state.session_id = session_id;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.session_id = action.payload.session_id;
        state.username = action.payload.username;
        state.loading = false;
        state.loaded = true;
        state.error = action.payload.failed;
      })
      .addCase(login.pending, (state, action) => {
        state.loading = true;
        state.loaded = false;
        state.error = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = true;
      })
      .addCase(authorize.fulfilled, (state, action) => {
        state.session_id = action.payload.session_id;
        state.error = action.payload.failed;
      })
      .addCase(authorize.pending, (state, action) => {})
      .addCase(authorize.rejected, (state, action) => {});
  },
});
export const { setToken } = user.actions;
export default user.reducer
