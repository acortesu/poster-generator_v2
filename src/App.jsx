import posterSketch from "./p5/posterSketch";
import p5 from "p5";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const sketch = new p5(posterSketch);
    return () => {
      sketch.remove();
    };
  }, []);

  return (
    <div className="App">
      <h1 className="font-bold">BAUHAUS</h1>
      <h2>POSTER GENERATOR</h2>
      <div id='canvasContainer'></div>
    </div>
  );
}

export default App;