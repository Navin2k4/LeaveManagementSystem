import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const TableSkeleton = () => {
  const skeletonRows = Array.from(Array(5).keys()); // Adjust the number of rows as needed

  return (
    <div>
      <Skeleton animation='wave' variant='rectangular' className=" shadow-md p-8 rounded-lg mb-4" />
      <div className="overflow-x-auto">
        <Table className=" rounded-md">
          <TableHead>
            <TableRow>
              <TableCell className="p-4   text-center text-white">
                <Skeleton variant="text" width={150} />
              </TableCell>
              <TableCell className="p-4   text-center text-white">
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell className="p-4   text-center text-white">
                <Skeleton variant="text" width={200} />
              </TableCell>
              <TableCell className="p-4   text-center text-white">
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell className="p-4   text-center text-white">
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell className="p-4   text-center text-white">
                <Skeleton variant="text" width={80} />
              </TableCell>
              <TableCell className="p-4   text-center text-white">
                <Skeleton variant="text" width={100} />
              </TableCell>
           
            </TableRow>
          </TableHead>
          <TableBody>
            {skeletonRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="  p-4">
                  <Skeleton variant="text" width={150} />
                </TableCell>
                <TableCell className="  p-4">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell className="  p-4">
                  <Skeleton variant="text" width={200} />
                </TableCell>
                <TableCell className="  p-4">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell className="  p-4">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell className="  p-4">
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell className="  p-4">
                  <Skeleton variant="text" width={100} />
                </TableCell>
          
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableSkeleton;
