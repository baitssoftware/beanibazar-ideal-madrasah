'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, ReactNode } from 'react';

import EmptyIcon from '../EmptyIcon';
import Loader from '../Loader';

export type SharedTableColumn = {
  title: string;
  dataKey: string;
  row: (data: any) => ReactNode;
};

export type SharedTableProps = {
  columns: SharedTableColumn[];
  data: any[];
  isLoading: boolean;
};

// eslint-disable-next-line react/display-name
const MemoizedRow: FC<{ row: any; columns: SharedTableColumn[] }> = React.memo(
  ({ row, columns }) => (
    <tr>
      {columns.map((column, colIndex) => (
        <td key={colIndex} className="px-2 border border-black/10 xl:px-5 py-1.5 h-fit break-words">
          {column.row(row)}
        </td>
      ))}
    </tr>
  ),
);

const SharedTable: FC<SharedTableProps> = ({ columns = [], data = [], isLoading = false }) => {
  // Ensure data is always an array, even when empty
  const hasData = data && data.length > 0;

  return (
    <div className="overflow-x-auto max-w-full text-[18px] text-sm">
      <div className="w-full">
        <table className="w-full text-left">
          <thead className="sticky z-10 top-0 w-full h-fit bg-white/30">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.dataKey || index} // Use dataKey or index if missing
                  scope="col"
                  className="px-5 py-3 text-[14px] border-r border-black/10 tableAction font-normal"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="w-full backdrop-blur-md  bg-white/20">
            {!isLoading &&
              hasData &&
              data.map((row, rowIndex) => (
                <MemoizedRow key={rowIndex} row={row} columns={columns} />
              ))}
          </tbody>
        </table>
        <div className="bg-black/50 backdrop-blur-sm">
          {isLoading && (
            <div className="flex justify-center py-3 items-center h-10 my-6">
              <Loader />
            </div>
          )}
          {!isLoading && !hasData && (
            <div className="flex gap-5 justify-center items-center my-6 py-3">
              <p className="">No Data Available</p>
              <EmptyIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedTable;
