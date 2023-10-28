import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://api.coinstats.app/public/v1/coins';

export const getCoins = createAsyncThunk('coins/getCoins', async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.coins;
  } catch (error) {
    return error.message;
  }
});

const initialState = {
  coinsArr: [],
  filteredList: [],
  status: 'idle',
  error: null,
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    updateFilteredList: (state, action) => {
      const filteredList = state.coinsArr.filter((coin) => (
        coin.name.toLowerCase().includes(action.payload.toLowerCase())));
      state.filteredList = filteredList;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCoins.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        if (Array.isArray(action.payload)) {
          const newArr = action.payload.map((coin) => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            img: coin.icon,
            price: coin.price,
            hour: coin.priceChange1h,
            change: coin.priceChange1d,
            week: coin.priceChange1w,
            web: coin.websiteUrl,
            marketCap: coin.marketCap,
            volume: coin.volume,
          }));
          state.coinsArr = newArr;
        } else {
        // Handle the case where action.payload is not an array (e.g., an error occurred).
          state.error = 'Unexpected data format in the API response';
        }
      })
      .addCase(getCoins.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCoins.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message;
      });
  },
});

export const { updateFilteredList } = coinsSlice.actions;

export default coinsSlice.reducer;
