import axios from 'axios';
import { isAppwriteEnabled } from './appwrite';
import { getCachedData, cacheData, queueSyncRequest } from './offlineStorage';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * A generic data access orchestrator that seamlessly routes between
 * Backend Express APIs, Appwrite Client APIs (when enabled),
 * and Offline fallback/queuing mechanisms.
 */
import { databases, dbId } from './appwrite';
import { Query } from 'appwrite';

export class DataService {
  private routePrefix: string;
  private collectionId?: string;

  constructor(routePrefix: string, collectionId?: string) {
    this.routePrefix = routePrefix;
    this.collectionId = collectionId;
  }

  async getAll(params?: any) {
    const cacheKey = `${this.routePrefix}_all_${JSON.stringify(params || {})}`;

    // 1. Try to fetch fresh from network
    if (navigator.onLine) {
      try {
        let result;
        if (isAppwriteEnabled && this.collectionId) {
           // Use Appwrite Client SDK for safe reads if available
           const queries = [];
           if (params) {
              for (const [k, v] of Object.entries(params)) {
                 queries.push(Query.equal(k, String(v)));
              }
           }
           const res = await databases.listDocuments(dbId, this.collectionId, queries);
           result = res.documents.map(d => {
             const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, ...rest } = d;
             return { id: $id, ...rest };
           });
        } else {
           // Fallback to Express backend
           const res = await apiClient.get(this.routePrefix, { params });
           result = res.data;
        }
        await cacheData(cacheKey, result);
        return result;
      } catch (err) {
        console.info(`Fetch from network failed for ${this.routePrefix}, falling back to cache`, err);
      }
    }

    // 2. Fallback to cache
    const cached = await getCachedData(cacheKey);
    return cached || [];
  }

  async getById(id: string) {
    const cacheKey = `${this.routePrefix}_${id}`;
    if (navigator.onLine) {
       try {
         let result;
         if (isAppwriteEnabled && this.collectionId) {
            const doc = await databases.getDocument(dbId, this.collectionId, id);
            const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, ...rest } = doc;
            result = { id: $id, ...rest };
         } else {
            const res = await apiClient.get(`${this.routePrefix}/${id}`);
            result = res.data;
         }
         await cacheData(cacheKey, result);
         return result;
       } catch (err) {
         console.info(`Fetch from network failed for ${this.routePrefix}/${id}, falling back to cache`);
       }
    }
    return await getCachedData(cacheKey);
  }

  async create(data: any) {
    if (navigator.onLine) {
      try {
        const res = await apiClient.post(this.routePrefix, data);
        return res.data;
      } catch (error) {
        throw error;
      }
    } else {
      // Offline Write - Queue it
      await queueSyncRequest(this.routePrefix, 'POST', data);
      return { ...data, _queued: true }; // Return optimistic result
    }
  }

  async update(id: string, data: any) {
    if (navigator.onLine) {
       try {
         const res = await apiClient.put(`${this.routePrefix}/${id}`, data);
         return res.data;
       } catch (error) {
         throw error;
       }
    } else {
      // Offline Write - Queue it
      await queueSyncRequest(`${this.routePrefix}/${id}`, 'PUT', data);
      return { ...data, _queued: true };
    }
  }
}
