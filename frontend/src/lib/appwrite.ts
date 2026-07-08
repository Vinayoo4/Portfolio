import { client } from '../services/appwrite';

export {
  client,
  account,
  databases,
  dbId,
  isAppwriteEnabled
} from '../services/appwrite';

export async function verifyAppwriteSetup(): Promise<boolean> {
  if (!client) return false;
  try {
    await client.ping();
    console.log('[Appwrite] Connection verified successfully');
    return true;
  } catch (err) {
    console.warn('[Appwrite] Ping failed:', err);
    return false;
  }
}
