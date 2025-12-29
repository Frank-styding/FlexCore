import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConnectionState {
  isConnected: boolean;
}

const initialState: ConnectionState = {
  isConnected: false,
};

export const DBConnectionSlice = createSlice({
  name: "DBconnection",
  initialState,
  reducers: {
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setIsConnected } = DBConnectionSlice.actions;
export default DBConnectionSlice.reducer;
