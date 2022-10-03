const numberButtons = document.querySelectorAll("[number-button]");
const operatorButtons = document.querySelectorAll("[operator-button]");
const lastOperationElem = document.querySelector("[last-operation]");
const currentOperationElem = document.querySelector("[current-operation]");
const equalButton = document.querySelector("[equal-button]");
const cancelButton = document.querySelector("[cancel-button]");
const cancelEntryButton = document.querySelector("[cancel-entry-button]");
const historyButton = document.querySelector("[history-button]");

class Calculator {
  constructor(lastOperationElem, currentOperationElem) {
    this.lastOperationElem = lastOperationElem;
    this.currentOperationElem = currentOperationElem;
    this.lastOperation = "";
    this.currentOperation = "";
  }

  displayOutput() {
    this.lastOperationElem.innerText = this.lastOperation;
    this.currentOperationElem.innerText = this.currentOperation;
  }

  addNumber(num) {
    if (
      num === "." &&
      (this.currentOperation.includes(".") || this.currentOperation === "")
    ) {
      return;
    }
    this.currentOperation = `${this.currentOperation}${num}`;
    this.displayOutput();
  }

  addOperator(oper) {
    const lastChar = this.lastOperation.charAt(this.lastOperation.length - 1);

    if (isNaN(lastChar) && this.currentOperation === "") return;

    if (this.currentOperation === "") return;

    this.lastOperation = `${this.lastOperation}${this.currentOperation}${oper}`;
    this.currentOperation = ``;
    this.displayOutput();
  }

  result() {
    if (this.lastOperation === "" || this.currentOperation === "") return;

    if (this.lastOperation.includes("=")) this.removeEqualFromOperation();

    this.currentOperation = this.calculate(
      `${this.lastOperation}${this.currentOperation}`
    );
    this.lastOperation = "";
    this.displayOutput();
  }

  calculate(operation) {
    const priorityOrder = ["/", "*", "+", "-"];
    let operator = null;

    priorityOrder.forEach((p) => {
      if (operation.includes(p)) {
        operator = p;
      }
    });

    const index = operation.lastIndexOf(operator);

    if (index == -1) return parseInt(operation);

    const leftOper = operation.substring(0, index);
    const rigthOper = operation.substring(index + 1, operation.length);

    switch (operator) {
      case "+":
        return this.calculate(leftOper) + this.calculate(rigthOper);
      case "-":
        return this.calculate(leftOper) - this.calculate(rigthOper);
      case "*":
        return this.calculate(leftOper) * this.calculate(rigthOper);
      case "/":
        return this.calculate(leftOper) / this.calculate(rigthOper);
      default:
        return;
    }
  }

  removeEqualFromOperation() {
    const last = this.lastOperation;
    this.lastOperation = last.substring(last.lastIndexOf("=") + 1, last.length);
    this.displayOutput();
  }

  cancel() {
    this.lastOperation = "";
    this.currentOperation = "";
    this.displayOutput();
  }

  cancelEntry() {
    this.currentOperation = this.currentOperation.toString().slice(0, -1);
    this.displayOutput();
  }

  save(operation) {
    if (operation == null) return;

    let history = JSON.parse(sessionStorage.getItem("history"));
    if (history == null) {
      history = new Array();
    }
    if (history.length === 3) {
      history.shift();
    }
    history.push(`${operation}= ${this.currentOperation}`);
    sessionStorage.setItem("history", JSON.stringify(history));
  }

  load() {
    const history = JSON.parse(sessionStorage.getItem("history"));

    if (history == null) return;

    const index = this.historyIndex(history.length - 1);
    const operation = history[index].split(" ");
    this.lastOperation = operation[0];
    this.currentOperation = operation[1];

    this.displayOutput();
  }

  historyIndex(maxIndex) {
    let lastIndex = sessionStorage.getItem("index");
    if (lastIndex != null) lastIndex = parseInt(lastIndex);

    const currentIndex =
      lastIndex == null || lastIndex == maxIndex ? 0 : (lastIndex += 1);

    sessionStorage.setItem("index", currentIndex);

    return currentIndex;
  }

  getOperation() {
    return this.lastOperation === "" || this.currentOperation === ""
      ? null
      : `${this.lastOperation}${this.currentOperation}`;
  }
}

const calculator = new Calculator(lastOperationElem, currentOperationElem);

numberButtons.forEach((number) => {
  number.addEventListener("click", () => {
    calculator.addNumber(number.innerText);
  });
});

operatorButtons.forEach((operator) => {
  operator.addEventListener("click", () => {
    calculator.addOperator(operator.innerText);
  });
});

equalButton.addEventListener("click", () => {
  const operation = calculator.getOperation();
  calculator.result();
  calculator.save(operation);
});

cancelButton.addEventListener("click", () => {
  calculator.cancel();
});

cancelEntryButton.addEventListener("click", () => {
  calculator.cancelEntry();
});

historyButton.addEventListener("click", () => {
  calculator.load();
});
