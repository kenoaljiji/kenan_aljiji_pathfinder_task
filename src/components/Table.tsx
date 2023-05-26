import React from 'react';

type TableProps = {
  results: any;
};
const Table: React.FC<TableProps> = ({ results }) => {
  return (
    <div>
      {results?.length > 0 && (
        <div className='results'>
          <h4>Results:</h4>
          <table>
            <thead>
              <tr>
                <th>Matrix Size</th>
                <th>Blocking Objects</th>
                <th>Execution Time (ms)</th>
                <th>Steps Count</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result: any, index: number) => (
                <tr key={index}>
                  <td>{result.matrixSize}</td>
                  <td>{result.blockingObjectCount}</td>
                  <td>{result.executionTime.toFixed(2)}</td>
                  <td>{result.stepsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Table;
