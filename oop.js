class Calculator {
    constructor() {
        this.input = document.querySelector("input");
        this.buttonsContainer = document.getElementById("buttons");
        this.createButtons();
        this.reset();

        // Bind method so 'this' works in event listeners
        this.handleClick = this.handleClick.bind(this);
        this.buttonsContainer.addEventListener("click", this.handleClick);
    }

    createButtons() {
        const layout = [
            ["AC", "<", "%", "÷"],
            ["7", "8", "9", "×"],
            ["4", "5", "6", "-"],
            ["1", "2", "3", "+"],
            ["0", ".", "="]
        ];

        layout.forEach(row => {
            const line = document.createElement("div");
            line.className = "line";

            row.forEach(symbol => {
                const btn = document.createElement("div");
                btn.className = "button";
                btn.textContent = symbol;

                // Styling classes
                if (["AC", "<", "%"].includes(symbol)) btn.classList.add("special-button");
                if (["÷", "×", "-", "+", "="].includes(symbol)) btn.classList.add("operator-button");
                if (symbol === "0") btn.classList.add("zero-button"); // optional: make it wider

                line.appendChild(btn);
            });

            this.buttonsContainer.appendChild(line);
        });
    }

    reset() {
        this.stored = null;
        this.operator = null;
        this.waitingForNewNumber = false;
        this.display("0");
    }

    display(value) {
        this.input.value = value;
    }

    inputDigit(digit) {
        if (this.waitingForNewNumber) {
            this.display(digit);
            this.waitingForNewNumber = false;
        } else {
            this.display(this.input.value === "0" ? digit : this.input.value + digit);
        }
    }

    inputDecimal() {
        if (this.waitingForNewNumber) {
            this.display("0.");
            this.waitingForNewNumber = false;
        } else if (!this.input.value.includes(".")) {
            this.display(this.input.value + ".");
        }
    }

    handleOperator(nextOperator) {
        const currentValue = parseFloat(this.input.value || "0");

        if (this.stored === null) {
            this.stored = currentValue;
        } else if (this.operator) {
            const result = this.calculate();
            if (result === "ERROR") {
                this.display("ERROR");
                this.reset();
                return;
            }
            this.display(result);
            this.stored = result;
        }

        this.waitingForNewNumber = true;
        this.operator = nextOperator;
    }

    calculate() {
        const prev = this.stored;
        const current = parseFloat(this.input.value || "0");

        switch (this.operator) {
            case "+": return prev + current;
            case "-": return prev - current;
            case "×": return prev * current;
            case "÷": return current === 0 ? "ERROR" : prev / current;
            default: return current;
        }
    }

    handleEqual() {
        if (!this.operator || this.stored === null) return;

        const result = this.calculate();
        if (result === "ERROR") {
            this.display("ERROR");
            this.reset();
        } else {
            this.display(result);
            this.stored = result;
            this.operator = null;
            this.waitingForNewNumber = true;
        }
    }

    backspace() {
        if (this.input.value.length <= 1 || this.input.value === "0") {
            this.display("0");
        } else {
            this.display(this.input.value.slice(0, -1));
        }
    }

    handleClick(e) {
        if (!e.target.classList.contains("button")) return;
        const value = e.target.textContent;

        if (!isNaN(value)) {
            this.inputDigit(value);
        }
        else if (value === ".") {
            this.inputDecimal();
        }
        else if (value === "AC") {
            this.reset();
        }
        else if (value === "<") {
            this.backspace();
        }
        else if (value === "=") {
            this.handleEqual();
        }
        else {
            this.handleOperator(value);
        }
    }
}

// Start the calculator when page loads
document.addEventListener("DOMContentLoaded", () => {
    new Calculator();
});