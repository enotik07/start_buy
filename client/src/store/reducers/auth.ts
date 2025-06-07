import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IAuthResponse } from '../../models/auth';
import { deleteTokens, getIsAdmin, getIsLogged, saveTokens } from '../../utils/authCookies';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAdmin: getIsAdmin(),
        isLogged: getIsLogged(),
    },
    reducers: {
        setTokens: (state, action: PayloadAction<IAuthResponse>) => {
            saveTokens(action.payload);
            state.isAdmin = action.payload.is_admin;
            state.isLogged = true;
        },
        clearTokens: (state) => {
            state.isLogged = false;
            state.isAdmin = false;
            deleteTokens();
        }
    },
});

export const { setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;