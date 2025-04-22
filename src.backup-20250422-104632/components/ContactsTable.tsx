'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Resizer } from './Resizer';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Badge } from "./ui/badge";
import { getContacts, deleteContact } from '@/lib/contacts'
import { Contact } from '@/types/contacts'
import { toast } from 'react-hot-toast'

export interface ContactsTableProps {
  contacts?: Contact[]
  onEdit?: (contact: Contact) => void
  onDelete?: (contact: Contact) => void
  onDeleteMany?: (ids: string[]) => void
}

interface ColumnWidth {
  [key: number]: number;
}

export function ContactsTable({
  contacts: initialContacts,
  onEdit,
  onDelete,
  onDeleteMany
}: ContactsTableProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts || [])
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const headers = ['EMPRESA', 'STATUS', 'CATEGORIA', 'TAGS', 'LOCALIZAÇÃO', 'TELEFONE', 'EMAIL', 'WEBSITE', 'AÇÕES'];
  const defaultColumnWidths: { [key: number]: number } = {
    0: 300,  // Empresa
    1: 150,  // Status
    2: 180,  // Categoria
    3: 200,  // Tags
    4: 180,  // Localização
    5: 180,  // Telefone
    6: 300,  // Email
    7: 120,  // Website
    8: 100   // Ações
  };

  // Remover a persistência no localStorage para manter as larguras sempre fixas
  const [columnWidths] = useState<ColumnWidth>(defaultColumnWidths);

  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    loadContacts()
  }, [])

  async function loadContacts() {
    try {
      setLoading(true)
      const contacts = await getContacts()
      console.log('Dados recebidos:', contacts)
      setContacts(contacts)
    } catch (error) {
      console.error('Erro ao carregar contatos:', error)
      toast.error('Erro ao carregar contatos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (contact: Contact) => {
    try {
      await deleteContact(contact.id)
      await loadContacts()
      toast.success('Contato excluído com sucesso')
      onDelete?.(contact)
    } catch (error) {
      console.error('Erro ao excluir contato:', error)
      toast.error('Erro ao excluir contato')
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedContacts.map(id => deleteContact(id)))
      await loadContacts()
      setSelectedContacts([])
      toast.success('Contatos excluídos com sucesso')
      onDeleteMany?.(selectedContacts)
    } catch (error) {
      console.error('Erro ao excluir contatos:', error)
      toast.error('Erro ao excluir contatos')
    }
  }

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(contacts.map(contact => contact.id))
    }
  }

  const toggleSelectContact = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const handleResize = (index: number, widthChange: number) => {
    // This function is now unused as column widths are fixed
  };

  const getColumnWidth = (index: number): number => {
    return defaultColumnWidths[index] || 120; // fallback para 120px
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return '-';
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length >= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, -4)}-${numbers.slice(-4)}`;
    }
    return phone;
  };

  const formatLocation = (location: string) => {
    if (!location) return '-';
    return location.replace(' -', '').trim();
  };

  const renderRow = (contact: Contact) => (
    <>
      <td className="w-[40px] py-4 pl-4 pr-3 sm:pl-6">
        <input 
          type="checkbox" 
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      </td>
      {[
        { 
          content: (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{contact.company_name || 'Sem nome'}</span>
              {contact.fantasy_name && (
                <span className="text-sm text-gray-500">{contact.fantasy_name}</span>
              )}
            </div>
          ), 
          className: "font-medium text-gray-900"
        },
        { 
          content: contact.status || '-', 
          className: "text-gray-500" 
        },
        { 
          content: contact.category || '-', 
          className: "text-gray-500" 
        },
        { 
          content: contact.tags?.join(', ') || '-', 
          className: "text-gray-500" 
        },
        { 
          content: formatLocation(contact.location || '-'), 
          className: "text-gray-500" 
        },
        { 
          content: (
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{formatPhone(contact.phone)}</span>
              {contact.phone && (
                <a 
                  href={`https://wa.me/55${contact.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Image
                    src="/whatsapp-icon.png"
                    alt="WhatsApp"
                    width={20}
                    height={20}
                    className="hover:opacity-80 transition-opacity"
                  />
                </a>
              )}
            </div>
          ),
          className: "whitespace-nowrap"
        },
        { 
          content: (
            <a 
              href={`mailto:${contact.email}`} 
              className="text-indigo-600 hover:text-indigo-900 whitespace-nowrap"
            >
              {contact.email?.toLowerCase() || '-'}
            </a>
          ), 
          className: "" 
        },
        { 
          content: contact.website ? (
            <a 
              href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 hover:text-indigo-900 whitespace-nowrap"
            >
              Acessar
            </a>
          ) : (
            <span className="text-gray-400">-</span>
          ), 
          className: "text-center" 
        },
        { 
          content: (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(contact)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(contact)}
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ), 
          className: "text-right" 
        }
      ].map((cell, index) => (
        <td 
          key={index}
          className="whitespace-nowrap py-4 px-3 text-sm"
          style={{ width: `${getColumnWidth(index)}px` }}
        >
          <div className={cell.className}>
            {cell.content}
          </div>
      </td>
      ))}
    </>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mt-4 flow-root">
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        {selectedContacts.length > 0 && (
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedContacts.length} {selectedContacts.length === 1 ? 'contato selecionado' : 'contatos selecionados'}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDeleteSelected}
              className="ml-4 bg-red-600 text-white hover:bg-red-700"
            >
              Excluir Selecionados
            </Button>
          </div>
        )}
        <div className="min-w-full align-middle">
          <div className="overflow-hidden">
            <table 
              ref={tableRef} 
              className="w-full table-fixed divide-y divide-gray-200"
              style={{
                width: Object.values(defaultColumnWidths).reduce((acc, width) => acc + width, 40) + 'px'
              }}
            >
              <thead className="bg-gray-50/75 backdrop-blur supports-[backdrop-filter]:bg-gray-50/75">
                <tr>
                  <th scope="col" className="w-[40px] py-3.5 pl-4 pr-3 sm:pl-6 sticky left-0 bg-gray-50/75 z-10">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedContacts.length === contacts.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  {headers.map((header, index) => (
                    <th
                      key={header}
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                      style={{ 
                        width: `${getColumnWidth(index)}px`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{header}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50/75 transition-colors duration-150">
                    <td className="w-[40px] py-4 pl-4 pr-3 sm:pl-6">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleSelectContact(contact.id)}
                      />
                    </td>
                    {[
                      { 
                        content: (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{contact.company_name || 'Sem nome'}</span>
                            {contact.fantasy_name && (
                              <span className="text-sm text-gray-500">{contact.fantasy_name}</span>
                            )}
                          </div>
                        ),
                        className: "font-medium text-gray-900"
                      },
                      {
                        content: (
                          <Badge
                            variant={
                              contact.status === 'Ativo' ? 'default' :
                              contact.status === 'Inativo' ? 'secondary' :
                              contact.status === 'Pendente' ? 'outline' :
                              contact.status === 'Arquivado' ? 'secondary' :
                              'default'
                            }
                            className={`w-full justify-center ${
                              contact.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                              contact.status === 'Inativo' ? 'bg-red-100 text-red-800' :
                              contact.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                              contact.status === 'Arquivado' ? 'bg-gray-100 text-gray-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {contact.status || 'Sem Status'}
                          </Badge>
                        ),
                        className: "text-center"
                      },
                      { 
                        content: (
                          <div className="truncate" title={contact.category || '-'}>
                            {contact.category || '-'}
                          </div>
                        ), 
                        className: "text-gray-500" 
                      },
                      {
                        content: contact.tags?.length ? (
                          <div className="flex flex-wrap gap-1 overflow-hidden">
                            {contact.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs truncate">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        ) : '-',
                        className: "text-gray-500"
                      },
                      { 
                        content: (
                          <div className="truncate" title={formatLocation(contact.location || '-')}>
                            {formatLocation(contact.location || '-')}
                          </div>
                        ), 
                        className: "text-gray-500" 
                      },
                      { 
                        content: (
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-gray-500 truncate" title={formatPhone(contact.phone)}>
                              {formatPhone(contact.phone)}
                            </span>
                            {contact.phone && (
                              <a 
                                href={`https://wa.me/55${contact.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center flex-shrink-0"
                              >
                                <Image
                                  src="/whatsapp-icon.png"
                                  alt="WhatsApp"
                                  width={20}
                                  height={20}
                                  className="hover:opacity-80 transition-opacity"
                                />
                              </a>
                            )}
                          </div>
                        ),
                        className: "max-w-0 w-full"
                      },
                      { 
                        content: (
                          <div className="truncate">
                            <a 
                              href={`mailto:${contact.email}`} 
                              className="text-indigo-600 hover:text-indigo-900"
                              title={contact.email?.toLowerCase() || '-'}
                            >
                              {contact.email?.toLowerCase() || '-'}
                            </a>
                          </div>
                        ), 
                        className: "max-w-0 w-full" 
                      },
                      { 
                        content: contact.website ? (
                          <a 
                            href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-indigo-600 hover:text-indigo-900 truncate block"
                            title={contact.website}
                          >
                            Acessar
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        ), 
                        className: "text-center" 
                      },
                      { 
                        content: (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit?.(contact)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(contact)}
                              className="text-red-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ), 
                        className: "text-right" 
                      }
                    ].map((cell, index) => (
                      <td 
                        key={index}
                        className="whitespace-nowrap py-4 px-3 text-sm"
                        style={{ 
                          width: `${getColumnWidth(index)}px`,
                        }}
                      >
                        <div className={`${cell.className} overflow-hidden`}>
                          {cell.content}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir {selectedContacts.length} {selectedContacts.length === 1 ? 'contato' : 'contatos'}? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 