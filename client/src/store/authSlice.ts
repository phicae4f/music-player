import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

interface AuthState {
    user: null | {
        id: number,
        username: string
    }
    token?: string | null,
    isLoading: boolean,
    error: string | null
}

const initialState: AuthState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
    token: localStorage.getItem("token") || null,
    isLoading: false,
    error: null
}

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async(credentials: {username: string, password: string}, {rejectWithValue}) => {
        try {
            const response = await fetch(`api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            })

            const data = await response.json()

            if(!response.ok) {
                throw new Error(data.message || "Не удалось зарегистрироваться")
            }
            return {
                message: data.message,
                username: credentials.username
            }
            
        } catch (error: any) {
            return rejectWithValue(error.message || "Не удалось зарегистрироваться")
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async(credentials: {username: string, password: string}, {rejectWithValue}) => {
        try {
            const response = await fetch(`api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            })

            const data = await response.json()
            console.log(data)

            if(!response.ok) {
                throw new Error(data.message || "Не удалось авторизоваться")
            }
            return {
                token: data.token,
                username: credentials.username
            }
        } catch (error: any) {
            return rejectWithValue(error.message || "Не удалось авторизоваться")
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null
            state.user = null
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("favourites")
        },
        clearAuthError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
        //REGISTER
        .addCase(registerUser.pending, (state) => {
            state.error = null
            state.isLoading = true
        })
        .addCase(registerUser.fulfilled, (state) => {
            state.isLoading = false
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload as string || "Ошибка регистрации"
        })
        //LOGIN
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.token = action.payload.token

            state.user = {
                id: Date.now(),
                username: action.payload.username
            }
            localStorage.setItem("user", JSON.stringify(state.user))
            localStorage.setItem("token", action.payload.token)
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.error = action.payload as string || "Ошибка авторизации"
        })
    }
}
)
export const {logout, clearAuthError} = authSlice.actions
export default authSlice.reducer