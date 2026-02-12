import { createJellyfinClient } from "./client";

interface LoginParams {
    serverUrl:string
    username:string
    password:string
}

export const loginJelyfin = async({
    serverUrl,
    username,
    password
}:LoginParams) => {
   const client = createJellyfinClient(serverUrl)
   const response = await client.post('/Users/AuthenticateByName',{
    Username: username,
    Pw: password
   })
   return {
    token:response.data.AccessToken,
    userid:response.data.User.Id,
    serverUrl   
   }
}
   