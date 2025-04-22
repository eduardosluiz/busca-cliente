import React, { useState, useRef } from 'react';
import { Resizer } from './Resizer';
import Image from 'next/image';
import { SearchResult } from '@/services/searchService';

interface SearchResultsTableProps {
  results: SearchResult[];
  selectedItems: string[];
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectItem: (id: string) => void;
  onSaveContact: (contact: SearchResult) => void;
}

interface ColumnWidth {
  [key: number]: number;
}

export function SearchResultsTable({ 
  results, 
  selectedItems, 
  onSelectAll, 
  onSelectItem, 
  onSaveContact 
}: SearchResultsTableProps) {
  const headers = ['EMPRESA', 'CATEGORIA', 'LOCALIZAÇÃO', 'TELEFONE', 'EMAIL', 'WEBSITE', 'AÇÕES'];
  const [columnWidths, setColumnWidths] = useState<ColumnWidth>({
    0: 200,  // Empresa
    1: 150,  // Categoria
    2: 150,  // Localização
    3: 160,  // Telefone
    4: 220,  // Email
    5: 100,  // Website
    6: 100   // Ações
  });
  const tableRef = useRef<HTMLTableElement>(null);

  const handleResize = (index: number, widthChange: number) => {
    setColumnWidths(prev => {
      const currentWidth = prev[index] || (index === 0 ? 200 : 120);
      const minWidth = index === 0 ? 200 :
                      index === 4 ? 220 :
                      index === 3 ? 160 :
                      120;
      
      const maxWidth = index === 0 ? 400 :
                      index === 4 ? 350 :
                      index === 3 ? 250 :
                      300;

      const newWidth = Math.min(maxWidth, Math.max(minWidth, currentWidth + widthChange));
      return { ...prev, [index]: newWidth };
    });
  };

  const getColumnWidth = (index: number) => {
    return columnWidths[index] || (index === 0 ? 200 : 120);
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return '-';
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length >= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, -4)}-${numbers.slice(-4)}`;
    }
    return phone;
  };

  return (
    <div className="mt-4 flow-root">
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="min-w-full align-middle inline-block">
          <div className="overflow-hidden">
            <table ref={tableRef} className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead>
                <tr className="bg-gray-50/75 backdrop-blur supports-[backdrop-filter]:bg-gray-50/75">
                  <th scope="col" className="w-[40px] py-3 pl-4 pr-3 sm:pl-6 sticky left-0 bg-gray-50/75 z-10">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-150"
                      checked={selectedItems.length === results.length}
                      onChange={onSelectAll}
                    />
                  </th>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={`py-3 px-3 text-left text-xs font-medium relative ${
                        index === 0 ? 'text-gray-900' : 'text-gray-500'
                      } uppercase tracking-wider ${index === 0 ? 'sticky left-[40px] bg-gray-50/75 z-10' : ''}`}
                      style={{ 
                        width: `${getColumnWidth(index)}px`,
                        minWidth: `${index === 0 ? 200 : index === 4 ? 220 : 120}px`
                      }}
                    >
                      <div className="flex items-center justify-between w-full h-full relative">
                        <span>{header}</span>
                        <div className="absolute right-0 top-0 bottom-0 w-1">
                          <Resizer
                            onResize={(width) => handleResize(index, width)}
                          />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50/75 transition-colors duration-150">
                    <td className="w-[40px] py-3 pl-4 pr-3 sm:pl-6">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-150"
                        checked={selectedItems.includes(result.id)}
                        onChange={() => onSelectItem(result.id)}
                      />
                    </td>
                    <td className="whitespace-nowrap py-3 px-3 text-sm">
                      <div className="font-medium text-gray-900">{result.name}</div>
                      {result.fantasyName && (
                        <div className="text-gray-500 text-xs mt-0.5">{result.fantasyName}</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3 px-3 text-sm text-gray-600">
                      {result.category || '-'}
                    </td>
                    <td className="whitespace-nowrap py-3 px-3 text-sm text-gray-600">
                      {result.location || '-'}
                    </td>
                    <td className="whitespace-nowrap py-3 px-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{formatPhone(result.phone)}</span>
                        {result.phone && (
                          <a 
                            href={`https://wa.me/55${result.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center hover:opacity-80 transition-opacity"
                          >
                            <Image
                              src="/whatsapp-icon.png"
                              alt="WhatsApp"
                              width={20}
                              height={20}
                              className="transition-transform hover:scale-105"
                            />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 px-3 text-sm">
                      {result.email ? (
                        <a 
                          href={`mailto:${result.email}`} 
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-150"
                        >
                          {result.email.toLowerCase()}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="whitespace-nowrap py-3 px-3 text-sm">
                      {result.website ? (
                        <a 
                          href={result.website.startsWith('http') ? result.website : `https://${result.website}`}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-150"
                        >
                          Acessar
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3 px-3 text-sm text-right">
                      <button
                        onClick={() => onSaveContact(result)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                      >
                        Salvar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500 text-right">
        ← Arraste para ver mais →
      </div>
    </div>
  );
} 