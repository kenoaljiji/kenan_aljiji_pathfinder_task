import React, { useEffect, useState } from 'react';
import Grid from './components/Grid';
import ControlPanel from './components/ControlPanel';
import './App.css';
import Table from './components/Table';

type Coordinate = [number, number];

const App: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isShowTable, setIsShowTable] = useState(false);
  const [matrixSize, setMatrixSize] = useState(5);
  const [startCoordinates, setStartCoordinates] = useState<[number, number]>([
    0, 0,
  ]);
  const [endCoordinates, setEndCoordinates] = useState<[number, number]>([
    matrixSize - 1,
    matrixSize - 1,
  ]);

  const [initialBlockingCount, setInitialBlockingCount] = useState(10);

  const [blockingObjectCount, setBlockingObjectCount] =
    useState(initialBlockingCount);

  const [movingObjectCoordinates, setMovingObjectCoordinates] = useState<
    Coordinate[]
  >([]);
  const [blockingObjectCoordinates, setBlockingObjectCoordinates] = useState<
    Coordinate[]
  >([]);

  const [executionTime, setExecutionTime] = useState<number>(0);
  const [stepsCount, setStepsCount] = useState<number>(0);

  useEffect(() => {
    // Generate initial blocking objects
    generateBlockingObjects();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Run the algorithm when movingObjectCoordinates or blockingObjectCoordinates change
    if (movingObjectCoordinates.length > 0) {
      onRunButtonClick(startCoordinates[0], startCoordinates[1]);
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }

    // eslint-disable-next-line
  }, [movingObjectCoordinates, blockingObjectCoordinates]);

  const handleRunButtonClick = (startX: number, startY: number) => {
    onRunButtonClick(startX, startY);
  };

  // Update the generateBlockingObjects function

  const generateBlockingObjects = () => {
    const newBlockingObjects: Coordinate[] = [];

    while (newBlockingObjects.length < blockingObjectCount) {
      const randomX = Math.floor(Math.random() * matrixSize);
      const randomY = Math.floor(Math.random() * matrixSize);

      // Check if the generated coordinates coincide with the start/end coordinates
      const isCoordinateStartOrEnd =
        (randomX === startCoordinates[0] && randomY === startCoordinates[1]) ||
        (randomX === endCoordinates[0] && randomY === endCoordinates[1]);

      if (!isCoordinateStartOrEnd) {
        newBlockingObjects.push([randomX, randomY]);
      }
    }

    setBlockingObjectCoordinates(newBlockingObjects);
  };

  const updateBlockingObjects = () => {
    // Generate new blocking objects
    generateBlockingObjects();

    // Check if the MO reached the end position
    const [currentX, currentY] =
      movingObjectCoordinates[movingObjectCoordinates.length - 1];

    if (currentX === endCoordinates[0] && currentY === endCoordinates[1]) {
      console.log('MO reached the destination!');
      setIsRunning(false);
      return;
    }
  };

  const resetHandeler = () => {
    setResults([]); // Clear previous results
    setIsRunning(false); // Stop the algorithm if it's running
    setMovingObjectCoordinates([]); // Clear the moving object coordinates
    setBlockingObjectCoordinates([]); // Clear the blocking object coordinates//
    generateBlockingObjects();
    setExecutionTime(0);
    setStepsCount(0);
    setIsShowTable(false);
  };

  const runAlgorithm = () => {
    const startTime = performance.now();

    if (movingObjectCoordinates.length === 0) {
      return;
    }

    const [currentX, currentY] =
      movingObjectCoordinates[movingObjectCoordinates.length - 1];

    // Check if MO reached the destination
    if (currentX === endCoordinates[0] && currentY === endCoordinates[1]) {
      setIsRunning(false);
      return;
    }

    // Find the next valid coordinate to move to
    const nextCoordinates: Coordinate | null = findNextCoordinates(
      currentX,
      currentY
    );

    // Check if there are no valid coordinates to move to
    if (!nextCoordinates) {
      // Reduce the blocking object count by 1 and try again
      setBlockingObjectCount((prevCount) => prevCount - 1);
      generateBlockingObjects();
      return;
    }

    setMovingObjectCoordinates((prevCoordinates: Coordinate[]) => [
      ...prevCoordinates,
      nextCoordinates,
    ]);

    updateBlockingObjects();

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    setExecutionTime((prevTime) => prevTime + executionTime);
    setStepsCount((prevCount) => prevCount + 1);
  };

  const findNextCoordinates = (
    currentX: number,
    currentY: number
  ): Coordinate | null => {
    // Generate all possible adjacent coordinates
    const possibleCoordinates: Coordinate[] = [
      [currentX - 1, currentY],
      [currentX + 1, currentY],
      [currentX, currentY - 1],
      [currentX, currentY + 1],
    ];

    const validCoordinates: Coordinate[] = possibleCoordinates.filter(
      ([x, y]) => {
        const isBlocked = blockingObjectCoordinates.find(
          ([bx, by]) => x === bx && y === by
        );
        const isAlreadyPassedThrough = movingObjectCoordinates.find(
          ([mx, my]) => x === mx && y === my
        );
        const isValid =
          x >= 0 && x < matrixSize && y >= 0 && y < matrixSize && y >= currentY;

        return isValid && !isBlocked && !isAlreadyPassedThrough;
      }
    );

    // Find the coordinate with the shortest distance to the destination
    let shortestDistance: number = Infinity;
    let nextCoordinates: Coordinate | null = null;

    for (let i = 0; i < validCoordinates.length; i++) {
      const [x, y] = validCoordinates[i];
      const distance: number =
        Math.abs(x - endCoordinates[0]) + Math.abs(y - endCoordinates[1]);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nextCoordinates = [x, y];
      }
    }

    return nextCoordinates;
  };

  const onRunButtonClick = (startX: number, startY: number) => {
    if (movingObjectCoordinates.length === 0) {
      // Generate new blocking objects
      generateBlockingObjects();

      // Find the next valid coordinate to move to
      const nextCoordinates: Coordinate | null = findNextCoordinates(
        startX,
        startY
      );

      if (nextCoordinates) {
        setMovingObjectCoordinates([nextCoordinates]);
        setIsRunning(true);
      } else {
        console.log('No valid coordinate found to start the algorithm.');
        setIsRunning(false);
      }
    } else {
      runAlgorithm();
    }
  };

  useEffect(() => {
    if (
      movingObjectCoordinates.length &&
      JSON.stringify(
        movingObjectCoordinates[movingObjectCoordinates.length - 1]
      ) === JSON.stringify(endCoordinates)
    ) {
      // Store the execution time and steps count in the results state
      setIsRunning(false);
      console.log('MO reached the destination!');
      setResults((prevResults) => [
        ...prevResults,
        { executionTime, stepsCount, matrixSize, blockingObjectCount },
      ]);
    }

    // eslint-disable-next-line
  }, [stepsCount, movingObjectCoordinates]);

  const runIterations = async () => {
    setIsShowTable(true);
    const matrixSizes = [5, 10, 20];
    const blockingObjectCounts = [
      [5, 10, 15],
      [10, 30, 81],
      [30, 100, 361],
    ];

    for (let i = 0; i < matrixSizes.length; i++) {
      const matrixSize = matrixSizes[i];
      const blockingObjectCountIteration = blockingObjectCounts[i];

      console.log(blockingObjectCountIteration);

      setMatrixSize(matrixSize);
      setStepsCount(0);
      setExecutionTime(0);
      setStartCoordinates([0, 0]);
      setEndCoordinates([matrixSize - 1, matrixSize - 1]);
      setMovingObjectCoordinates([]);
      setBlockingObjectCoordinates([]);

      for (let j = 0; j < blockingObjectCountIteration.length; j++) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds

        const blockingObjectCount = blockingObjectCountIteration[j];

        setBlockingObjectCount((prevBlockingObjectCount) => {
          if (prevBlockingObjectCount !== blockingObjectCount) {
            return blockingObjectCount;
          }
          return prevBlockingObjectCount;
        });

        onRunButtonClick(startCoordinates[0], startCoordinates[1]);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds

      const lastBlockingObjectCount =
        blockingObjectCountIteration[blockingObjectCountIteration.length - 1];

      setBlockingObjectCount((prevBlockingObjectCount) => {
        if (prevBlockingObjectCount !== lastBlockingObjectCount) {
          return lastBlockingObjectCount;
        }
        return prevBlockingObjectCount;
      });

      onRunButtonClick(startCoordinates[0], startCoordinates[1]);
    }
  };

  const handleRunIterationsClick = () => {
    resetHandeler(); // Reset state before running iterations
    runIterations();
  };

  return (
    <div className='App'>
      <h1>Matrix Pathfinding</h1>
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        {results.length > 0 && !isShowTable && (
          <div className='results'>
            <h4>Results:</h4>

            {results.map((result, index) => (
              <ul key={index}>
                <li>Execution Time: {result.executionTime.toFixed(2)} ms,</li>
                <li>Steps Count: {result.stepsCount}</li>
              </ul>
            ))}
          </div>
        )}
      </div>
      <ControlPanel
        onRunButtonClick={handleRunButtonClick}
        setBlockingObjectCount={setBlockingObjectCount}
        blockingObjectCount={blockingObjectCount}
        setStartCoordinates={setStartCoordinates}
        setEndCoordinates={setEndCoordinates}
        setMatrixSize={setMatrixSize}
        matrixSize={matrixSize}
        handleResetButtonClick={resetHandeler}
        runIterations={handleRunIterationsClick}
        setInitialBlockingCount={setInitialBlockingCount}
        isRunning={isRunning}
      />
      <Grid
        matrixSize={matrixSize}
        startCoordinates={startCoordinates}
        endCoordinates={endCoordinates}
        movingObjectCoordinates={movingObjectCoordinates}
        blockingObjectCoordinates={blockingObjectCoordinates}
      />
      {isShowTable && <Table results={results} />}
    </div>
  );
};

export default App;
