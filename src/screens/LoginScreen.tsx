import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../stores";
import { TextInput,Text,View,Button } from "react-native";
import { login } from "../stores/authSlice";
import { useState } from "react";


export default function LoginScreen(){
    const dispatch = useDispatch<AppDispatch>()
    const status = useSelector((state:RootState) => state.auth.status);
    const [data,setData] = useState({
        serverUrl:'',
        username:'',
        password:''
    })
    return (
    <View style={{ padding: 20 }}>
      <Text>Jellyfin Login</Text>

      <TextInput placeholder="Server URL" value={data.serverUrl} onChangeText={(text) => setData({...data, serverUrl: text})} />
      <TextInput placeholder="Username" value={data.username} onChangeText={(text) => setData({...data, username: text})} />
      <TextInput placeholder="Password" value={data.password} onChangeText={(text) => setData({...data, password: text})} secureTextEntry />

      <Button
        title={status === 'loading' ? 'Logging in...' : 'Login'}
        onPress={() =>
          dispatch(login({ serverUrl: data.serverUrl, username: data.username, password: data.password }))
        }
      />
    </View>
  )
}