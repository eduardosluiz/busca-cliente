import React, { useState, useEffect } from 'react';
import { MessageSquare, Edit2, Trash2, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { Contact } from '@/types/contact';

interface NewContactsTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onDeleteMany: (ids: string[]) => void;
  selectedContacts: string[];
  onSelectContacts: (ids: string[]) => void;
}

export function NewContactsTable({ 
  contacts,
  onEdit,
  onDelete,
  onDeleteMany,
  selectedContacts,
  onSelectContacts
}: NewContactsTableProps) {
  // Limpa seleção quando os contatos mudam (mudança de página)
  useEffect(() => {
    onSelectContacts([]);
  }, [contacts, onSelectContacts]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectContacts(contacts.map(contact => contact.id));
    } else {
      onSelectContacts([]);
    }
  };

  const handleSelectContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      onSelectContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      onSelectContacts([...selectedContacts, contactId]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedContacts.length > 0 && window.confirm(`Tem certeza que deseja excluir ${selectedContacts.length} contatos?`)) {
      onDeleteMany(selectedContacts);
    }
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return '-';
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length >= 10) {
      return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    }
    return phone;
  };

  const truncateUrl = (url: string) => {
    if (!url) return '-';
    const domain = url.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
    return domain.length > 25 ? domain.substring(0, 25) + '...' : domain;
  };

  return (
    <div className="w-full space-y-4">
      {/* Barra de ações para itens selecionados */}
      {selectedContacts.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-100 rounded-lg">
          <span className="text-sm text-blue-700 font-medium">
            {selectedContacts.length} {selectedContacts.length === 1 ? 'contato selecionado' : 'contatos selecionados'}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDeleteSelected}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Excluir Selecionados
          </Button>
        </div>
      )}

      {/* Tabela */}
      <div className="relative overflow-hidden border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm divide-y divide-gray-200">
            {/* Cabeçalho */}
            <thead className="bg-gray-50">
              <tr className="divide-x divide-gray-200">
                <th className="sticky left-0 z-10 bg-gray-50 w-10 px-2 py-3">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === contacts.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer hover:border-blue-500 transition-colors"
                    />
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Empresa</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Categoria</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Localização</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">Telefone</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Email</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Website</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Ações</th>
              </tr>
            </thead>

            {/* Corpo */}
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr 
                  key={contact.id}
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    selectedContacts.includes(contact.id) && "bg-blue-50"
                  )}
                >
                  <td className="sticky left-0 z-10 bg-white px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => handleSelectContact(contact.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer hover:border-blue-500 transition-colors"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">
                    {contact.company_name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {contact.category}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {contact.address.city}, {contact.address.state}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    <div className="flex items-center gap-2">
                      {formatPhone(contact.phone)}
                      {contact.phone && (
                        <a
                          href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-600 transition-colors"
                          title="Abrir WhatsApp"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {contact.email || '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {contact.website ? (
                      <a
                        href={contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                        title={contact.website}
                      >
                        <LinkIcon className="h-3 w-3" />
                        {truncateUrl(contact.website)}
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(contact)}
                        className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Editar contato"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(contact)}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Excluir contato"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mensagem quando não há contatos */}
        {contacts.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            Nenhum contato encontrado
          </div>
        )}
      </div>
    </div>
  );
} 