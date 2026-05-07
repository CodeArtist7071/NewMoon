import { createJellyfinClient } from "./client";

interface LoginParams {
    serverUrl: string
    username: string
    password: string
}

export const loginJelyfin = async ({
    serverUrl,
    username,
    password,
}: LoginParams) => {
    const client = createJellyfinClient(serverUrl)

    try {
        const response = await client.post(
            '/Users/AuthenticateByName',
            {
                Username: username,
                Pw: password,
            },
            {
                headers: {
                    'X-Emby-Authorization':
                        'MediaBrowser Client="MyApp", Device="Android", DeviceId="reactnative", Version="1.0.0"',
                    'Content-Type': 'application/json',
                },
            }
        )

        return {
            token: response.data.AccessToken,
            userid: response.data.User.Id,
            serverUrl,
        }
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            throw new Error('Invalid username or password');
        } else if (!error.response) {
            throw new Error('Could not connect to server. Please check your URL.');
        }
        throw new Error(error.message || 'An unexpected error occurred during login');
    }
}
