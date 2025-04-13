import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export interface ProfileData {
  email: string;
  name: string;
  company: string;
  phone: string;
  cpf: string;
  emailNotifications: boolean;
  whatsappNotifications: boolean;
}

export async function getUserProfile(): Promise<ProfileData> {
  const response = await api.get('/profile');
  return response.data;
}

export async function updateUserProfile(data: ProfileData): Promise<ProfileData> {
  const response = await api.put('/profile', data);
  return response.data;
} 