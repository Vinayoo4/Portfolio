import { Client, Databases, Account } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || '';
const project = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';

export const client = new Client();

if (endpoint && project) {
  client.setEndpoint(endpoint).setProject(project);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const dbId = databaseId;

export const isAppwriteEnabled = Boolean(endpoint && project && databaseId);
