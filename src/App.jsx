import { useRef, useState } from "react";

function App() {
  const canvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [isErasing, setIsErasing] = useState(false);
  const [history, setHistory] = useState([]);
const [redoStack, setRedoStack] = useState([]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.beginPath();
    context.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    setIsDrawing(true);
  };

  const saveState = () => {
  const canvas = canvasRef.current;

  setHistory((prev) => [
    ...prev,
    canvas.toDataURL(),
  ]);

  setRedoStack([]);
};

  const stopDrawing = () => {
  setIsDrawing(false);
  saveState();
  };
  const undo = () => {
  if (history.length === 0) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const previousState =
    history[history.length - 1];

  setRedoStack((prev) => [
    ...prev,
    canvas.toDataURL(),
  ]);

  const img = new Image();

  img.src = previousState;

  img.onload = () => {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.drawImage(img, 0, 0);
  };

  setHistory((prev) =>
    prev.slice(0, -1)
  );
};
const redo = () => {
  if (redoStack.length === 0) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const nextState =
    redoStack[redoStack.length - 1];

  setHistory((prev) => [
    ...prev,
    canvas.toDataURL(),
  ]);

  const img = new Image();

  img.src = nextState;

  img.onload = () => {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.drawImage(img, 0, 0);
  };

  setRedoStack((prev) =>
    prev.slice(0, -1)
  );
};

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.lineWidth = brushSize;
    context.lineCap = "round";

    context.globalCompositeOperation =
      isErasing ? "destination-out" : "source-over";

    context.strokeStyle = color;

    context.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    context.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    
    const canvas = canvasRef.current;

    const link = document.createElement("a");

    link.download = "whiteboard.png";
    link.href = canvas.toDataURL("image/png");

    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Interactive Whiteboard</h1>

      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          gap: "12px",  
         alignItems: "center",
          flexWrap: "wrap",
        }}
        
      >
        <input
  type="color"
  value={color}
  onChange={(e) => setColor(e.target.value)}
/>

<input
  type="range"
  min="1"
  max="20"
  value={brushSize}
  onChange={(e) =>
    setBrushSize(Number(e.target.value))
  }
/>

<span>
  Brush: {brushSize}px
</span>

<button onClick={clearCanvas}>
  Clear Canvas
</button>

<button onClick={undo}>
  Undo
</button>

<button onClick={redo}>
  Redo
</button>

<button onClick={downloadCanvas}>
  Download PNG
</button>

<button onClick={() => setIsErasing(!isErasing)}>
  {isErasing ? "Brush" : "Eraser"}
</button>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onMouseMove={draw}
        style={{
          border: "2px solid black",
          backgroundColor: "white",
          maxWidth: "100%",
        }}
      />
    </div>
  );
}

export default App;