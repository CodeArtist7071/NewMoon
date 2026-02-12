import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginJelyfin } from "../services/jellyfin/auth";
import { clearSession, loadSession, saveSession } from "../utils/session";
import { createJellyfinClient } from "../services/jellyfin/client";


export const login = createAsyncThunk('auth/login',
    async(params:any)=>{
        const data = await loginJelyfin(params)
        await saveSession(data)
        createJellyfinClient(data.serverUrl,data.token)
        return data
    }
)


export const restoreSession = createAsyncThunk('auth/restore',
    async()=>{
        const session = await loadSession()
        if (!session) return null
        createJellyfinClient(session.serverUrl,session.token)
        return session          
    }
)

interface AuthState {
    token: string | null
    userid: string | null
    serverUrl:string | null
    status:'idle'| 'loading' | 'error'

}

const initialState :AuthState = {
    token:null,
    userid:null,
    serverUrl:null,
    status:'idle'
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setCredentials(state,action){
            state.token = action.payload.token
            state.userid = action.payload.userid
            state.serverUrl = action.payload.serverUrl
            state.status = 'idle'
        },
        logout(state){
            state.token = null
            state.userid = null
            state.serverUrl = null
            clearSession()
        }
    },
    extraReducers:builder =>{
        builder.addCase(login.pending,(state)=>{
            state.status = 'loading'
        })  
        builder.addCase(login.fulfilled,(state,action)=>{
            if(!action.payload) return 
            state.token = action.payload.token
            state.userid = action.payload.userid
            state.serverUrl = action.payload.serverUrl  
            state.status = 'idle'
        })
        builder.addCase(login.rejected,(state,action)=>{
            state.status = 'error'
        })
        builder.addCase(restoreSession.pending,(state)=>{
            state.status = 'loading'
        })  
        builder.addCase(restoreSession.fulfilled,(state,action)=>{
            if(action.payload){
                state.token = action.payload.token
                state.userid = action.payload.userid
                state.serverUrl = action.payload.serverUrl
            }
            state.status = 'idle'
        })
        builder.addCase(restoreSession.rejected,(state,action)=>{
            state.status = 'error'
        })  
    }
})

export const {setCredentials,logout} = authSlice.actions
export default authSlice.reducer