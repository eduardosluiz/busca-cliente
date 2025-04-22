import React from 'react';

interface TableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
}

export function Table({ headers, data, renderRow }: TableProps) {
  // Larguras fixas para cada coluna
  const columnWidths = [
    'w-[280px]', // EMPRESA
    'w-[200px]', // CATEGORIA
    'w-[180px]', // LOCALIZAÇÃO
    'w-[180px]', // TELEFONE
    'w-[280px]', // EMAIL
    'w-[120px]', // WEBSITE
    'w-[100px]'  // AÇÕES
  ];

  return (
    <table className="w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              scope="col"
              className={`${columnWidths[index]} px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50`}
            >
              <div className="truncate">
                {header}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.length === 0 ? (
          <tr>
            <td 
              colSpan={headers.length}
              className="px-6 py-4 text-center text-sm text-gray-500"
            >
              Nenhum registro encontrado
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <tr 
              key={index} 
              className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
            >
              {renderRow(item)}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
} 