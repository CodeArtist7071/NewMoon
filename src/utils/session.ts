import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = 'JELLYFIN_SESSION'

export const saveSession = async (sessionData:any) => {
    await AsyncStorage.setItem(KEY, JSON.stringify(sessionData))
}

export const loadSession = async()=>{
    const raw = await AsyncStorage.getItem(KEY)
    if(raw){
        return JSON.parse(raw)
    }
    return null
}

export const clearSession = async()=>{
    await AsyncStorage.removeItem(KEY)
}