import Profile from '@/components/Profile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meu Perfil | BuscaCliente.IA',
  description: 'Gerencie suas informações de perfil',
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <Profile />
    </div>
  );
} 