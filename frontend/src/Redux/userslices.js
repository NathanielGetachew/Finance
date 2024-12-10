import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BASE_URL from "../utils/BaseUrl";
import axios from "axios";
import { resetErrorAction, resetSuccessAction } from "./Global/globalSlice";

// intitialize
const INTITIAL_STATE = {
  loading: false,
  error: null,
  users: [],
  user: null,
  reports: [],
  deposits:[],
  success: false,
  userAuth: {
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

//! Register user Action
export const registerAction = createAsyncThunk(
  "users/register",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // make request
    try {
      const { data } = await axios.post(`${BASE_URL}/users/register`, payload);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//! login Action
export const loginAction = createAsyncThunk(
  "users/login",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // make request
    try {
      const { data } = await axios.post(`${BASE_URL}/users/login`, payload);
      //! save the user into local storage
      localStorage.setItem("userInfo", JSON.stringify(data));

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//! logout action
export const logoutAction = createAsyncThunk("users/logout", async () => {
  // remove token from the localstorage
  localStorage.removeItem("userInfo");
  return true;
});

export const getReportsAction = createAsyncThunk(
  "reports/getReports",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { users } = getState();
      const token = users?.userAuth?.userInfo?.token;
      console.log("Fetching reports for userId:", userId);
      console.log("Token:", token);

      const { data } = await axios.get(`${BASE_URL}/reports/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response:", data);
      // Extract the `report` from the response
      return data.report ? [data.report] : [];
    } catch (error) {
      console.error("Error fetching reports:", error.response?.data || error.message);
      return rejectWithValue(error?.response?.data || "Failed to fetch reports");
    }
  }
);
// Make deposit action
export const createDepositAction = createAsyncThunk(
  "users/createDeposit",
  async ({ amount, frequency }, { getState, rejectWithValue }) => {
    try {
      const { users } = getState();
      const token = users?.userAuth?.userInfo?.token;

      if (!token) {
        return rejectWithValue("User is not authenticated.");
      }

      const response = await axios.post(
        `${BASE_URL}/deposits`,
        { amount, frequency },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token
          },
        }
      );

      return response.data.deposit; // Return the deposit from the API response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create deposit");
    }
  }
);



// Fetch deposits action
export const getDepositsAction = createAsyncThunk(
  "users/getDeposits",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { users } = getState(); // Get the state from Redux
      const token = users?.userAuth?.userInfo?.token; // Extract the token from the Redux state
      console.log("Fetching deposits for userId:", userId);
      console.log("Token:", token);

      if (!token) {
        return rejectWithValue("No token found. User is not authenticated.");
      }

      const { data } = await axios.get(`${BASE_URL}/deposits/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Include the JWT token in the Authorization header
        },
      });

      console.log("API Response:", data);
      // If deposits exist, return them; otherwise, return an empty array
      return data.deposits || [];
    } catch (error) {
      console.error("Error fetching deposits:", error.response?.data || error.message);
      return rejectWithValue(error?.response?.data || "Failed to fetch deposits");
    }
  }
);




//  Profile Fetching API action
export const getUserProfileAction = createAsyncThunk(
  "users/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/profile`, {
        // Update this URL to your actual endpoint
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userInfo")?.token}`,
        },
      });
      return data; // Adjust to match the response structure
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: INTITIAL_STATE,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    //Rgister
    builder.addCase(registerAction.pending, (state, action) => {
      state.loading = true;
    });
    // handle the fulfilled state
    builder.addCase(registerAction.fulfilled, (state, action) => {
      state.user = action.payload;
      state.success = true;
      state.loading = false;
      state.error = null;
    });
    //* handle the rejection
    builder.addCase(registerAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    //login
    builder.addCase(loginAction.pending, (state, action) => {
      state.loading = true;
    });
    // handle the fulfilled state
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.userAuth.userInfo = action.payload;
      state.success = true;
      state.loading = false;
      state.error = null;
    });
    //* handle the rejection
    builder.addCase(loginAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    // User Profile
    builder.addCase(getUserProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.userProfile = action.payload; // Store profile data
      state.success = true;
    });
    builder.addCase(getUserProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload; // Capture any error that occurred
    });

    // Reports
    builder.addCase(getReportsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getReportsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.reports = Array.isArray(action.payload) ? action.payload : [action.payload];;
      state.error = null;
    });
    builder.addCase(getReportsAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

 // Handle deposits
 builder.addCase(getDepositsAction.pending, (state) => {
  state.loading = true;
})
builder.addCase(getDepositsAction.fulfilled, (state, action) => {
  state.loading = false;
  state.deposits = action.payload;  // Store the deposits in the state
})
builder.addCase(getDepositsAction.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;  // Store the error in the state
});


// Create deposit action
builder.addCase(createDepositAction.pending, (state) => {
  state.loading = true;
});
builder.addCase(createDepositAction.fulfilled, (state, action) => {
  state.loading = false;
  state.deposits.push(action.payload); // Add the new deposit to the state
  state.error = null;
});
builder.addCase(createDepositAction.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});



    //! Reset Error Action
    builder.addCase(resetErrorAction.fulfilled, (state) => {
      state.error = null;
    });

    //! Reset Success Action
    builder.addCase(resetSuccessAction.fulfilled, (state) => {
      state.success = false;
    });
  },
});

//! Generate Reducers
const usersReducer = userSlice.reducer;
export const { resetState } = userSlice.actions;

export default usersReducer;
