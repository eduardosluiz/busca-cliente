import React from 'react';
import { Table } from './Table';
import Image from 'next/image';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  lastContact: string;
}

interface ContactsTableProps {
  contacts: Contact[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  const headers = ['Nome', 'Email', 'Telefone', 'Empresa', 'Último Contato', 'Ações'];

  const renderRow = (contact: Contact) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{contact.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{contact.phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{contact.company}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{contact.lastContact}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-indigo-600 hover:text-indigo-900 mr-4">
          Editar
        </button>
        <button className="text-red-600 hover:text-red-900">
          Excluir
        </button>
      </td>
    </>
  );

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <Table headers={headers} data={contacts} renderRow={renderRow} />
          </div>
        </div>
      </div>
    </div>
  );
} 