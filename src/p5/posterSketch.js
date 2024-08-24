import { GUI } from "dat.gui";

export default function posterSketch(p) {
  let horizontalMargin, verticalMargin;

  const figureConfig = {
    squareWeight: 100,
    circleWeight: 0,
    arcWeight: 0,
    oneArcFigureWeight: 0,
  };

  const colorConfig = {
    yellowWeight: 20,
    orangeWeight: 20,
    blackWeight: 20,
    beigeWeight: 0,
    blueWeight: 20,
  };

  let scaleFactor = 1;
  let newWidth = 440;
  let newHeight = 640;

  p.setup = () => {
    let saveCompButton = p.createButton("JPEG");
    saveCompButton.mousePressed(saveComposition);
    let cnv = p.createCanvas(440, 640);
    cnv.parent("canvasContainer");
    p.noLoop();
    p.dat = { GUI: GUI };
    setupGUI();
    drawFigures();
    // p.background(220);
  };

  function setupGUI() {
    const gui = new p.dat.GUI();
    gui.add(figureConfig, "squareWeight", 0, 100).onChange(drawFigures);
    gui.add(figureConfig, "circleWeight", 0, 100).onChange(drawFigures);
    gui.add(figureConfig, "arcWeight", 0, 100).onChange(drawFigures);
    gui.add(figureConfig, "oneArcFigureWeight", 0, 100).onChange(drawFigures);

    gui.add(colorConfig, "yellowWeight", 0, 100).onChange(drawFigures);
    gui.add(colorConfig, "orangeWeight", 0, 100).onChange(drawFigures);
    gui.add(colorConfig, "blackWeight", 0, 100).onChange(drawFigures);
    gui.add(colorConfig, "beigeWeight", 0, 100).onChange(drawFigures);
    gui.add(colorConfig, "blueWeight", 0, 100).onChange(drawFigures);
  }
  //
  // p.draw = () => {
  //   p.ellipse(p.mouseX, p.mouseY, 50, 50);
  // };

  function drawFigures() {
    p.clear();
    p.background("#FFFFFF");
    p.noStroke();

    // Configuración de tamaños de cuadrados
    const smallSquareSize = 100 * scaleFactor;

    horizontalMargin = (newWidth - 4 * 100 * scaleFactor) / 2;
    verticalMargin = (newHeight - 6 * 100 * scaleFactor) / 2;

    for (let i = 0; i < 6; i++) {
      let size;
      for (let j = 0; j < 4; j++) {
        size = smallSquareSize;
        let x = horizontalMargin + j * 100 * scaleFactor;
        let y = verticalMargin + i * 100 * scaleFactor;

        let figureType = getWeightedFigure();
        let color = getWeightedColor();
        let quadrant = getQuadrant(figureType);

        drawShape(x, y, figureType, color, quadrant, size);
      }
    }
  }

  function getQuadrant(figureType) {
    if (figureType === "arc" || figureType === "oneArcFigure") {
      return Math.floor(p.random(4));
    } else if (figureType === "twoOppArcFigure") {
      return Math.floor(p.random(2));
    }
    return undefined;
  }

  function getWeightedFigure() {
    let weightSum =
      figureConfig.squareWeight +
      figureConfig.circleWeight +
      figureConfig.arcWeight +
      figureConfig.oneArcFigureWeight;

    let normalizedWeights = {
      square: (figureConfig.squareWeight / weightSum) * 100,
      circle: (figureConfig.circleWeight / weightSum) * 100,
      arc: (figureConfig.arcWeight / weightSum) * 100,
      oneArcFigure: (figureConfig.oneArcFigureWeight / weightSum) * 100,
    };

    let randomNumber = p.random(100);
    let sum = 0;

    for (let figure in normalizedWeights) {
      sum += normalizedWeights[figure];
      if (randomNumber < sum) {
        return figure;
      }
    }
  }

  function getWeightedColor() {
    let totalWeight =
      colorConfig.yellowWeight +
      colorConfig.orangeWeight +
      colorConfig.blackWeight +
      colorConfig.beigeWeight +
      colorConfig.blueWeight;
    let randomNum = p.random(totalWeight);
    let sum = 0;

    if (randomNum < (sum += colorConfig.yellowWeight)) return "#FF3737";
    if (randomNum < (sum += colorConfig.orangeWeight)) return "#F1C5E5";
    if (randomNum < (sum += colorConfig.blackWeight)) return "#9E68E3";
    if (randomNum < (sum += colorConfig.beigeWeight)) return "#F6EDF0";
    if (randomNum < (sum += colorConfig.blueWeight)) return "#0C33BD";
    return "#000000";
  }

  function drawShape(x, y, type, color, quadrant, size) {
    p.fill(color);
    p.noStroke();
    p.lastFigureData = [];
    switch (type) {
      case "square":
        drawSquare(x, y, size);
        break;
      case "circle":
        drawCircle(x, y, size);
        break;
      case "arc":
        drawArc(x, y, quadrant, size);
        break;
      case "oneArcFigure":
        drawOneArcFigure(x, y, quadrant, size);
        break;
    }
  }

  function drawSquare(x, y, size) {
    p.rect(x, y, size * scaleFactor, size * scaleFactor);
  }

  function drawCircle(x, y, size) {
    p.ellipse(
      x + (size / 2) * scaleFactor,
      y + (size / 2) * scaleFactor,
      size * scaleFactor
    );
  }

  function drawArc(x, y, quadrant, size) {
    switch (quadrant) {
      case 0:
        p.arc(
          x + size * scaleFactor,
          y + size * scaleFactor,
          size * 2 * scaleFactor,
          size * 2 * scaleFactor,
          p.PI,
          p.PI + p.HALF_PI
        );
        break;

      case 1:
        p.arc(
          x,
          y + size * scaleFactor,
          size * 2 * scaleFactor,
          size * 2 * scaleFactor,
          p.PI + p.HALF_PI,
          p.TWO_PI
        );
        break;

      case 2:
        p.arc(
          x,
          y,
          size * 2 * scaleFactor,
          size * 2 * scaleFactor,
          0,
          p.HALF_PI
        );
        break;

      case 3:
        p.arc(
          x + size * scaleFactor,
          y,
          size * 2 * scaleFactor,
          size * 2 * scaleFactor,
          p.HALF_PI,
          p.PI
        );
        break;
    }
  }

  function drawOneArcFigure(x, y, quadrant, size) {
    p.beginShape();
    switch (quadrant) {
      case 0: // Curva en el cuadrante superior izquierdo
        p.arc(
          x + (size / 2) * scaleFactor,
          y + (size / 2) * scaleFactor,
          size * scaleFactor,
          size * scaleFactor,
          p.PI,
          p.PI + p.HALF_PI
        );
        p.rect(
          x + (size / 2) * scaleFactor,
          y,
          (size / 2) * scaleFactor,
          (size / 2) * scaleFactor
        );
        p.rect(
          x,
          y + (size / 2) * scaleFactor,
          size * scaleFactor,
          (size / 2) * scaleFactor
        );
        break;
      case 1: // Curva en el cuadrante superior derecho
        p.arc(
          x + (size / 2) * scaleFactor,
          y + (size / 2) * scaleFactor,
          size * scaleFactor,
          size * scaleFactor,
          p.PI + p.HALF_PI,
          p.TWO_PI
        );
        p.rect(x, y, (size / 2) * scaleFactor, (size / 2) * scaleFactor);
        p.rect(
          x,
          y + (size / 2) * scaleFactor,
          size * scaleFactor,
          (size / 2) * scaleFactor
        );
        p.endShape();
        break;
      case 2: // Curva en el cuadrante inferior derecho
        p.arc(
          x + (size / 2) * scaleFactor,
          y + (size / 2) * scaleFactor,
          size * scaleFactor,
          size * scaleFactor,
          0,
          p.HALF_PI
        );
        p.rect(
          x,
          y + (size / 2) * scaleFactor,
          (size / 2) * scaleFactor,
          (size / 2) * scaleFactor
        );
        p.rect(x, y, size * scaleFactor, (size / 2) * scaleFactor);
        break;
      case 3: // Curva en el cuadrante inferior izquierdo
        p.arc(
          x + (size / 2) * scaleFactor,
          y + (size / 2) * scaleFactor,
          size * scaleFactor,
          size * scaleFactor,
          p.HALF_PI,
          p.PI
        );
        p.rect(
          x + (size / 2) * scaleFactor,
          y + (size / 2) * scaleFactor,
          (size / 2) * scaleFactor,
          (size / 2) * scaleFactor
        );
        p.rect(x, y, size * scaleFactor, (size / 2) * scaleFactor);
        break;
    }
    p.endShape();
  }

  function saveComposition() {
    p.saveCanvas("miImagen", "png");
  }
}
