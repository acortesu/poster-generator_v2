import React, { useRef, useEffect } from "react";

const WrapperP5 = ({ posterSketch }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const p5Instance = new (posterSketch, canvasRef.current)();
    return () => {
      p5Instance.remove();
    };
  }, [posterSketch]);
  return <div ref={canvasRef}></div>;
};

export default WrapperP5;
