import axios from 'axios';
import { UserProfile } from '@/types/user';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export async function getUserProfile(): Promise<UserProfile> {
  const response = await api.get('/profile');
  return response.data;
}

export async function updateUserProfile(data: UserProfile): Promise<UserProfile> {
  const response = await api.put('/profile', data);
  return response.data;
} 