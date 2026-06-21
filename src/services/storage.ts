import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'sc.token';

/** Bearer-token persistence. Kept in one place so the api client and auth
 *  context share a single source of truth. */
export const tokenStore = {
  async get(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async set(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },
  async clear(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};
