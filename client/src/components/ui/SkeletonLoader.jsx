import React from 'react';
import { Skeleton } from '@mui/material';

const SkeletonLoader = ({ type }) => {
  switch (type) {
    case 'header':
      return <Skeleton variant="text" width="60%" height={30} />;
    case 'list':
      return (
        <ul className="space-y-2">
          {[1, 2, 3].map((_, index) => (
            <li key={index} className="py-2">
              <Skeleton variant="rectangular" width="100%" height={40} />
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <Table>
          <TableHead>
            <TableRow>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                <TableCell key={index}>
                  <Skeleton variant="text" width="100%" height={40} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4].map((_, index) => (
              <TableRow key={index}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((_, subIndex) => (
                  <TableCell key={subIndex}>
                    <Skeleton variant="rectangular" width="100%" height={40} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    default:
      return <Skeleton variant="rectangular" width="100%" height={40} />;
  }
};

export default SkeletonLoader;
