const buttons = document.querySelectorAll(".button");
const display = document.getElementById("product");

buttons.forEach((button) => {
  switch (true) {
    case button.classList.contains("button-operator"):
      button.addEventListener("click", operatorButton);
      break;
    case button.classList.contains("button-other"):
      button.addEventListener("click", otherButton);
      break;
    case button.classList.contains("button-equals"):
      button.addEventListener("click", equalsButton);
      break;
    default:
      button.addEventListener("click", operandButton);
      break;
  }
});

const operation = { current: 0, operator: "", total: 0 };

function operandButton(e) {
  const { operand } = e.target.dataset;
  display.innerText += operand;
  operation.current = Number(display.innerText);
  console.log(operation);
}

function operatorButton(e) {
  const { operator } = e.target.dataset;

  if (operation.total === 0) {
    operation.total += operation.current;
  } else {
    switch (operation.operator) {
      case "+":
        operation.total += operation.current;
        break;
      case "-":
        operation.total -= operation.current;
        break;
      case "x":
        operation.total *= operation.current;
        break;
      case "/":
        operation.current !== 0
          ? (operation.total /= operation.current)
          : (display.innerText = "Error");
        break;
    }
  }

  operation.operator = operator;
  display.innerText = "";
  operation.current = 0;
  console.log(operation);
}

function equalsButton(e) {
  switch (operation.operator) {
    case "+":
      operation.total += operation.current;
      break;
    case "-":
      operation.total -= operation.current;
      break;
    case "x":
      operation.total *= operation.current;
      break;
    case "/":
      operation.current !== 0
        ? (operation.total /= operation.current)
        : (display.innerText = "Error");
      break;
  }
  display.innerText = operation.total;
  operation.current = 0;
  operation.operator = "";
  console.log(operation);
}

function otherButton(e) {
  switch (true) {
    case e.target.classList.contains("reset"):
      display.innerText = "";
      operation.current = 0;
      operation.operator = "";
      operation.total = 0;
      break;
    case e.target.classList.contains("polarity"):
      /^-/.test(display.innerText)
        ? (display.innerText = display.innerText.slice(
            1,
            display.innerText.length
          ))
        : (display.innerText = "-".concat(display.innerText));
      operation.current = Number(display.innerText);
      break;
    case e.target.classList.contains("percent"):
      const percent = (operation.current / 100) * operation.total;

      switch (operation.operator) {
        case "+":
          operation.total += percent;
          break;
        case "-":
          operation.total -= percent;
          break;
        case "x":
          operation.total *= percent;
          break;
        case "/":
          operation.current !== 0
            ? (operation.total /= percent)
            : (display.innerText = "Error");
          break;
      }
      display.innerText = operation.total;
      operation.current = 0;
      operation.operator = "";
      console.log(operation);
  }
  console.log(operation);
}
