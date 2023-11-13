import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SetCookies, readCookies } from "../utils";

const initialState = {
  loading: false,
  loaded: false,
  error: false,
  authorized: null,
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
    var { username, session_id } = readCookies();
    var response = await fetch("/user/authorize", {
      method: "POST",
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
    if (json.status) {
      return { failed: false};
    } else {
      return { failed: true, session_id: null };
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (params, thunkAPI) => {
    var { username, session_id } = readCookies();
    var response = await fetch("/user/logout", {
      method: "POST",
      headers: {
        user: username,
        session: session_id,
      },
    });
    var status = await response.status;
    if (status !== 200) {
      return { failed: true };
    }
    return {
      failed: false,
    };
  }
);

export const user = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        SetCookies(action.payload.username, action.payload.session_id);
        state.authorized = !action.payload.failed;
      })
      .addCase(login.pending, (state, action) => {})
      .addCase(login.rejected, (state, action) => {
        state.error = true;
        state.authorized = false;
      })
      .addCase(authorize.fulfilled, (state, action) => {
        state.authorized = !action.payload.failed;
      })
      .addCase(authorize.pending, (state, action) => {})
      .addCase(authorize.rejected, (state, action) => {
        state.authorized = false;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.authorized = false;
      })
      .addCase(logout.pending, (state, action) => {})
      .addCase(logout.rejected, (state, action) => {});
  },
});
export const { setToken } = user.actions;
export default user.reducer;
