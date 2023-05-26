import React, { FC } from 'react';

type Coordinate = [number, number];

interface GridProps {
  matrixSize: number;
  startCoordinates: Coordinate;
  endCoordinates: Coordinate;
  movingObjectCoordinates: Coordinate[];
  blockingObjectCoordinates: Coordinate[];
}

const Grid: FC<GridProps> = ({
  matrixSize,
  startCoordinates,
  endCoordinates,
  movingObjectCoordinates,
  blockingObjectCoordinates,
}) => {
  const checkRowSize = matrixSize >= 10 ? '1.5rem' : '3rem';
  const gridStyle = {
    display: 'grid',
    width: '15%',
    maxWidth: '80rem',
    gridTemplateColumns: `repeat(${matrixSize}, 1fr)`,
    gridTemplateRows: 'auto',
    justifyContent: 'center',
    margin: '3rem auto 4rem auto',
    background: 'white',
  };

  const divStyle = {
    width: checkRowSize,
    height: checkRowSize,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const renderCell = (x: number, y: number) => {
    const isStart = startCoordinates[0] === x && startCoordinates[1] === y;
    const isEnd = endCoordinates[0] === x && endCoordinates[1] === y;
    const isMovingObject = movingObjectCoordinates.some(
      ([mx, my]) => mx === x && my === y
    );
    const isBlockingObject = blockingObjectCoordinates.some(
      ([bx, by]) => bx === x && by === y
    );

    let cellClass = 'cell';
    if (isStart) cellClass += ' start';
    if (isEnd) cellClass += ' end';
    if (isMovingObject) cellClass += ' moving-object';
    if (isBlockingObject) cellClass += ' blocking-object';

    return (
      <div key={`${x}-${y}`} className={cellClass} style={divStyle}>
        {cellClass.includes('start') ? 'S' : cellClass.includes('end') && 'E'}
      </div>
    );
  };

  const renderGrid = () => {
    const grid: JSX.Element[] = [];

    for (let y = 0; y < matrixSize; y++) {
      for (let x = 0; x < matrixSize; x++) {
        grid.push(renderCell(x, y));
      }
    }

    return grid;
  };

  return <div style={gridStyle}>{renderGrid()}</div>;
};

export default Grid;
