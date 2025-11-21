const cals = [
  [7, 8, 9, "+"],
  [4, 5, 6, "-"],
  [1, 2, 3, "×"],
  [".", 0, "=", "÷"],
  ["AC", "<"],
];
const number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const tNumber = number.slice(0, -1);
const operator = ["+", "-", "×", "÷"];
const input = document.querySelector("input");
for (let i = 0; i < cals.length; i++) {
  const line = document.createElement("div");
  line.classList.add("line");
  for (let j = 0; j < cals[i].length; j++) {
    const btn = document.createElement("div");
    btn.classList.add("button");
    btn.textContent = cals[i][j];
    line.appendChild(btn);
  }
  buttons.appendChild(line);
}

const btns = document.querySelectorAll(".button");
document.addEventListener("DOMContentLoaded", () => {
  let operation = "";
  let firstNum = 0;
  let secondNum =0
  let result = 0;
  let equalCount = false;
  function show() {
    console.log(`operation is ${operation}`);
    console.log(`first number is ${firstNum}`);
    console.log(`second number is ${secondNum}`);
    console.log(`Result is ${result}`);
    console.log(`equal button is ${equalCount}`)
  }
  btns.forEach((btn) => {
    if (btn.textContent == "AC" || btn.textContent == "<") {
      btn.classList.add("special-button");
    }
    btn.addEventListener("click", (e) => {
      const value = e.target.textContent;
      show();
      if (number.includes(value)) {
        if (value === "." && input.value.includes(".")) {
          // avoid repeated .
          return;
        }
        if (tNumber.includes(value) && input.value[0] === "0"&&input.value[1]!==".") {// avoid 00 pattern
          input.value = value;
          return;
        }
        if (result !== 0 && !operation && equalCount) { 
          //if result is already there, reset display and let user input a new number
          input.value = "";
          result = 0;
          equalCount = false;
        }
        if(result!== 0 &&equalCount === false &&operation){
          input.value = "";
          firstNum = result;
          result =0;
        }
        input.value += value;
        return;
      }

      if (operator.includes(value) || value === "=") {
        if (!input.value && !firstNum) return;

        if(firstNum==false){firstNum = input.value;}
        console.log(firstNum)
        const currentNum = input.value || firstNum;//avoid empty input
        if (operation && currentNum) {
          secondNum = currentNum;
          result = operate(firstNum, operation, secondNum);
          firstNum = result;
          
          input.value = result;
          operation = "";
          show();
          return;
        } else {
          firstNum = currentNum;
        }
        if (value === "=") {
          input.value = firstNum;
          operation = "";
          secondNum = 0;
          equalCount = true;
        } else {
          operation = value;
          input.value = ""; // clear for next input
        }
        return;
      }
      if (e.target.textContent == "AC") {
        firstNum = 0;
        secondNum = 0;
        operation = "";
        result = 0;
        input.value = "";
        equalCount = false;
        return;
      }
      if (e.target.textContent == "<") {
        input.value = input.value.slice(0, -1);
        return;
      }
    });
  });
});
function operate(firstNum, operation, secondNum) {
  if (operation == "+") {
    return Number(firstNum) + Number(secondNum);
  }
  if (operation == "-") {
    return Number(firstNum) - Number(secondNum);
  }
  if (operation == "×") {
    return Number(firstNum) * Number(secondNum);
  }

  if (operation == "÷") {
    if (secondNum != 0) {
      return Number(firstNum) / Number(secondNum);
    }
    return "ERROR";
  }
}
