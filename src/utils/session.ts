import { createMMKV  } from 'react-native-mmkv';

const storage = createMMKV();
const KEY = 'JELLYFIN_SESSION';

export const saveSession = (sessionData: any) => {
storage.set(KEY, JSON.stringify(sessionData));
};

export const loadSession = () => {
  const raw = storage.getString(KEY);
  if (raw) {
    return JSON.parse(raw);
  }
  return null;
};

export const clearSession = () => {
  storage.remove(KEY);
};