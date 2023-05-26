import React, { useState, useEffect } from 'react';
import ControlPanel from './ControlPanel';
import Grid from './Grid';
import './App.css';

const App = () => {
  const [matrixSize, setMatrixSize] = useState(5);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(matrixSize - 1);
  const [endY, setEndY] = useState(matrixSize - 1);
  const [blockingObjectCount, setBlockingObjectCount] = useState(0);
  const [movingObjectCoordinates, setMovingObjectCoordinates] = useState([]);
  const [blockingObjectCoordinates, setBlockingObjectCoordinates] = useState(
    []
  );

  useEffect(() => {
    // Generate initial blocking objects
    generateBlockingObjects();
  }, []);

  useEffect(() => {
    // Run the algorithm when movingObjectCoordinates or blockingObjectCoordinates change
    if (movingObjectCoordinates.length > 0) {
      runAlgorithm();
    }
  }, [movingObjectCoordinates, blockingObjectCoordinates]);

  const generateBlockingObjects = () => {
    const newBlockingObjects = [];

    for (let i = 0; i < blockingObjectCount; i++) {
      const randomX = Math.floor(Math.random() * matrixSize);
      const randomY = Math.floor(Math.random() * matrixSize);

      // Check if the generated coordinates are already blocked or the start/end coordinates
      if (
        !newBlockingObjects.find(([x, y]) => x === randomX && y === randomY) &&
        (randomX !== startX || randomY !== startY) &&
        (randomX !== endX || randomY !== endY)
      ) {
        newBlockingObjects.push([randomX, randomY]);
      }
    }

    setBlockingObjectCoordinates(newBlockingObjects);
  };

  const runAlgorithm = () => {
    const [currentX, currentY] =
      movingObjectCoordinates[movingObjectCoordinates.length - 1];

    // Check if MO reached the destination
    if (currentX === endX && currentY === endY) {
      console.log('MO reached the destination!');
      return;
    }

    // Find the next valid coordinate to move to
    const nextCoordinates = findNextCoordinates(currentX, currentY);

    // Check if there are no valid coordinates to move to
    if (!nextCoordinates) {
      // Reduce the blocking object count by 1 and try again
      setBlockingObjectCount((prevCount) => prevCount - 1);
      generateBlockingObjects();
      return;
    }

    setMovingObjectCoordinates((prevCoordinates) => [
      ...prevCoordinates,
      nextCoordinates,
    ]);
  };

  const findNextCoordinates = (currentX, currentY) => {
    // Generate all possible adjacent coordinates
    const possibleCoordinates = [
      [currentX - 1, currentY],
      [currentX + 1, currentY],
      [currentX, currentY - 1],
      [currentX, currentY + 1],
    ];

    // Filter out coordinates that are blocked or already passed through
    const validCoordinates = possibleCoordinates.filter(
      ([x, y]) =>
        x >= 0 &&
        x < matrixSize &&
        y >= 0 &&
        y < matrixSize &&
        !blockingObjectCoordinates.find(([bx, by]) => x === bx && y === by) &&
        !movingObjectCoordinates.find(([mx, my]) => x === mx && y === my)
    );

    // Find the coordinate with the shortest distance to the destination
    let shortestDistance = Infinity;
    let nextCoordinates = null;

    for (let i = 0; i < validCoordinates.length; i++) {
      const [x, y] = validCoordinates[i];
      const distance = Math.abs(x - endX) + Math.abs(y - endY);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nextCoordinates = [x, y];
      }
    }

    return nextCoordinates;
  };

  const onRunButtonClick = () => {
    if (movingObjectCoordinates.length === 0) {
      // Set the initial position of the moving object (MO)
      setMovingObjectCoordinates([[startX, startY]]);
    } else {
      // Continue the algorithm by moving the MO one coordinate
      runAlgorithm();
    }
  };

  return (
    <div className='app'>
      <h1>MO and BO Path</h1>
      <ControlPanel
        matrixSize={matrixSize}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
        blockingObjectCount={blockingObjectCount}
        setMatrixSize={setMatrixSize}
        setStartX={setStartX}
        setStartY={setStartY}
        setEndX={setEndX}
        setEndY={setEndY}
        setBlockingObjectCount={setBlockingObjectCount}
        onRunButtonClick={onRunButtonClick}
      />
      <Grid
        matrixSize={matrixSize}
        startCoordinates={[startX, startY]}
        endCoordinates={[endX, endY]}
        movingObjectCoordinates={movingObjectCoordinates}
        blockingObjectCoordinates={blockingObjectCoordinates}
      />
    </div>
  );
};

export default App;
