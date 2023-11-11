import React, { useState, CSSProperties, useEffect } from 'react';

type ControlPanelProps = {
  setBlockingObjectCount: React.Dispatch<React.SetStateAction<number>>;
  setInitialBlockingCount: React.Dispatch<React.SetStateAction<number>>;
  blockingObjectCount: number;
  matrixSize: number;
  setMatrixSize: React.Dispatch<React.SetStateAction<number>>;
  setStartCoordinates: any;
  setEndCoordinates: any;
  onRunButtonClick: (startX: number, startY: number) => void;
  handleResetButtonClick: any;
  runIterations: any;
  isRunning: boolean;
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  onRunButtonClick,
  setBlockingObjectCount,
  matrixSize,
  setMatrixSize,
  setStartCoordinates,
  setEndCoordinates,
  handleResetButtonClick,
  blockingObjectCount,
  runIterations,
  setInitialBlockingCount,
  isRunning,
}) => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(matrixSize - 1);
  const [endY, setEndY] = useState(matrixSize - 1);
  const [blockCount, setBlockCount] = useState(blockingObjectCount);

  const handleMatrixSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSize = parseInt(event.target.value);
    setMatrixSize(newSize);
    setEndX(newSize - 1);
    setEndY(newSize - 1);
    handleResetButtonClick();
  };

  const handleStartXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    setStartX(newValue);
    handleResetButtonClick();
  };

  const handleStartYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    setStartY(newValue);
    handleResetButtonClick();
  };

  const handleEndXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    setEndX(newValue);
    handleResetButtonClick();
  };

  const handleEndYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    setEndY(newValue);
    handleResetButtonClick();
  };

  const handleBlockingObjectCountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newCount = parseInt(event.target.value, 10);
    setBlockCount(newCount);
    setBlockingObjectCount(newCount);
    setInitialBlockingCount(newCount);
  };

  const handleRunButtonClick = () => {
    onRunButtonClick(startX, startY);
  };

  useEffect(() => {
    setStartCoordinates([startX, startY]);

    // eslint-disable-next-line
  }, [startX, startY]);

  useEffect(() => {
    setEndCoordinates([endX, endY]);

    // eslint-disable-next-line
  }, [endX, endY]);

  useEffect(() => {
    if (!isRunning) {
      setBlockingObjectCount(blockCount);
    }

    // eslint-disable-next-line
  }, [blockCount, isRunning]);

  interface FormStyle extends CSSProperties {
    width: string;
    margin: string;
    textAlign: 'center' | 'left' | 'right' | 'justify' | 'initial' | 'inherit';
  }

  interface FlexStyle extends CSSProperties {
    display: string;
    justifyContent: string;
  }

  const formStyle: FormStyle = {
    width: '300px',
    margin: '0 auto',
    textAlign: 'center',
  };

  const flexStyle: FlexStyle = {
    display: 'flex',
    justifyContent: 'center',
  };

  return (
    <div className='control-panel'>
      <div style={formStyle}>
        <div style={flexStyle}>
          <div className='input-group'>
            <label htmlFor='start-x-input'>Start X:</label>
            <input
              type='number'
              id='start-x-input'
              min={0}
              max={matrixSize - 1}
              value={startX}
              onChange={handleStartXChange}
            />
          </div>
          <div className='input-group'>
            <label htmlFor='start-y-input'>Start Y:</label>
            <input
              type='number'
              id='start-y-input'
              min={0}
              max={matrixSize - 1}
              value={startY}
              onChange={handleStartYChange}
            />
          </div>
          <div className='input-group'>
            <label htmlFor='end-x-input'>End X</label>
            <input
              type='number'
              id='end-x-input'
              min={0}
              max={matrixSize - 1}
              value={endX}
              onChange={handleEndXChange}
            />
          </div>
          <div className='input-group'>
            <label htmlFor='end-y-input'>End Y</label>
            <input
              type='number'
              id='end-y-input'
              min={0}
              max={matrixSize - 1}
              value={endY}
              onChange={handleEndYChange}
            />
          </div>
        </div>
        <div className='input-group'>
          <label htmlFor='matrix-size-input'>Matrix Size:</label>
          <input
            type='number'
            id='matrix-size-input'
            min={1}
            value={matrixSize}
            onChange={handleMatrixSizeChange}
          />
        </div>

        <div className='input-group'>
          <label htmlFor='blocking-object-count-input'>
            Blocking Object Count:
          </label>
          <input
            type='number'
            id='blocking-object-count-input'
            min={0}
            value={blockCount}
            onChange={handleBlockingObjectCountChange}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <button onClick={handleResetButtonClick}>Reset</button>
          <button onClick={handleRunButtonClick}>Run</button>
          <button onClick={runIterations}>Run Iteration</button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
