import React from 'react';

interface TableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
}

export function Table({ headers, data, renderRow }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {renderRow(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 