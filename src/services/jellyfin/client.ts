import axios from "axios";
import DeviceInfo from "react-native-device-info";

let apiClient = axios.create()

export const createJellyfinClient = (serverUrl:string,token?:string) => {
    if(!serverUrl) throw new Error('Server URL is required to create Jellyfin client')
    apiClient = axios.create({
        baseURL: serverUrl,
        headers:{
               'Content-Type': 'application/json',
      'X-Emby-Authorization': `MediaBrowser Client="JellyfinMusic",
        Device="Android",
        DeviceId="${DeviceInfo.getUniqueIdSync()}",
        Version="1.0.0"`,
      ...(token ? { 'X-Emby-Token': token } : {}),
        },
    })
    return apiClient
}

export const getClient = () =>{
    if(!apiClient) throw new Error('Jellyfin client not initialized')
    return apiClient
}