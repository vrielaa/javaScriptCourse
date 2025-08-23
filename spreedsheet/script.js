// A simple spreadsheet implementation supporting basic arithmetic and functions.

//infix to function mapping for basic arithmetic operations + - * /
//eg "+": (x, y) => x + y for addition operation
const infixToFunction = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
}
// Evaluates infix expressions in a string based on the provided regex pattern
//eg. "3+5" with regex /([\d.]+)([+-])([\d.]+)/ will return 8
//step by step
//1. replace assigns the matched groups to arg1, operator, arg2
//2. (str, regex) => str.replace(regex, (_match, arg1, operator, arg2) becomes (3, "+", 5)
//3. now all becomes (3, "+", 5) => infixToFunction["+"](parseFloat(3), parseFloat(5))
//4.  infixToFunction[operator] becomes infixToFunction["+"] which is (x, y) => x + y
//5. parseFloat(arg1) becomes parseFloat(3) which is 3
//6. parseFloat(arg2) becomes parseFloat(5) which is 5
//7. so it becomes "sumfunction"(3, 5) which is 3 + 5 = 8
//8. at the end (3, "+", 5) => 8 is returned as a string "8

//if SUM(1,2,3) is passed it will not match the regex and return "SUM(1,2,3)" which is handled as one of the spreadsheet functions

const infixEval = (str, regex) => str.replace(regex, (_match, arg1, operator, arg2) => infixToFunction[operator](parseFloat(arg1), parseFloat(arg2)));


// Handles high precedence operations (* and /) first in the expression
//eg. "3+5*2" will first evaluate "5*2" to "10" resulting in "3+10"
//eg "3+ SUM(1,2*3) * 2"
//step by step
//1. in the first call highPrecedence("3+ SUM(1,2*3) * 2")
//2. regex will match number operator number pattern for * and /
//3. infixEval("3+ SUM(1,2*3) * 2", /([\d.]+)([*\/])([\d.]+)/) will match "2*3" and evaluate it to "6" resulting in "3+ SUM(1,6) * 2"

const highPrecedence = str => {
    const regex = /([\d.]+)([*\/])([\d.]+)/;
    const str2 = infixEval(str, regex);
    return str === str2 ? str : highPrecedence(str2);
}



const isEven = num => num % 2 === 0;
const sum = nums => nums.reduce((acc, el) => acc + el, 0);
const average = nums => sum(nums) / nums.length;

const median = nums => {
    const sorted = nums.slice().sort((a, b) => a - b);
    const length = sorted.length;
    const middle = length / 2 - 1;
    return isEven(length)
        ? average([sorted[middle], sorted[middle + 1]])
        : sorted[Math.ceil(middle)];
}

const spreadsheetFunctions = {

    sum,
    average,
    median,
    even: nums => nums.filter(isEven),
    someeven: nums => nums.some(isEven),
    everyeven: nums => nums.every(isEven),
    firsttwo: nums => nums.slice(0, 2),
    lasttwo: nums => nums.slice(-2),
    has2: nums => nums.includes(2),
    increment: nums => nums.map(num => num + 1),
    random: ([x, y]) => Math.floor(Math.random() * y + x),
    range: nums => range(...nums),
    nodupes: nums => [...new Set(nums).values()],
    '': arg => arg
}

// Applies spreadsheet functions to the expression in the string
//eg. "SUM(1,2,3)" will return "6"
//eg step by step "3+SUM(1,2*3) * 2"
//1. highPrecedence("3+SUM(1,2*3) * 2") will first evaluate "2*3" to "6" resulting in "3+SUM(1,6) * 2"
//2. infixEval("3+SUM(1,6) * 2", /([\d.]+)([+-])([\d.]+)/) will match "3+...*2" but since "...*2" is not a number it will not evaluate and return "3+SUM(1,6) * 2"
//3. functionCall is a regex to match function calls like SUM(1,2,3) or AVERAGE(4,5,6)
//4. str2.replace(functionCall, (match, fn, args) => ...) will match "SUM(1,6)" and call the apply function with fn as "SUM" and args as "1,6"
//5. apply("SUM", "1,6") will return 7
//6. so it becomes "3+7 * 2"
//7 returns "3+7 * 2" as a string

const applyFunction = str => {
    const noHigh = highPrecedence(str);
    const infix = /([\d.]+)([+-])([\d.]+)/;
    const str2 = infixEval(noHigh, infix);
    //regex to match function calls like SUM(1,2,3) or AVERAGE(4,5,6)
    const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;
    const toNumberList = args => args.split(",").map(parseFloat);
    //eg apply("SUM", "1,2,3") will return 6
    //step by step
    //1. fn becomes "SUM" and args becomes "1,2,3"
    //2. fn.toLowerCase() becomes "sum"
    //3. spreadsheetFunctions[fn.toLowerCase()] becomes spreadsheetFunctions["sum"] which is sum function defined above
    //4. toNumberList(args) becomes toNumberList("1,2,3") which is [1, 2, 3]
    //5. so it becomes spreadsheetFunctions["sum"]([1, 2, 3]) which is sum([1, 2, 3]) = 6
    //6. at the end apply("SUM", "1,2,3") will return 6 as a string "6"
    const apply = (fn, args) => spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
    return str2.replace(functionCall, (match, fn, args) => spreadsheetFunctions.hasOwnProperty(fn.toLowerCase()) ? apply(fn, args) : match);
}

const range = (start, end) => Array(end - start + 1).fill(start).map((element, index) => element + index);
const charRange = (start, end) => range(start.charCodeAt(0), end.charCodeAt(0)).map(code => String.fromCharCode(code));

// Evaluates the formula in the string, replacing cell references and ranges with their values
//eg. if cell A1 has value 5 and cell A2 has value 10
//then evalFormula("=A1+A2", cells) will return "15"
//eg. if cell A1 has value 5, A2 has value 10, A3 has value 15
//then evalFormula("=SUM(A1:A3)", cells) will return "30"
//step by step
//1. idToText is a function that takes a cell id (like "A1") and returns the value of that cell from the cells array
//2. rangeRegex is a regex to match cell ranges like "A1:A3"
//3. rangeFromString is a function that takes two numbers as strings and returns an array of numbers in that range
//4. elemValue is a function that takes a number and returns a function that takes a character and returns the value of the cell with that character and number
//5. getCellValuesInCharRangeForRow is a function that could be written as
//function getCellValuesInCharRangeForRow(character1, character2, num) {
//    const chars = charRange(character1, character2);
//    return chars.map(character => idToText(character + num));
//}
    const evalFormula = (x, cells) => {
    const idToText = id => cells.find(cell => cell.id === id).value;
    const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
    const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));
    const elemValue = num => character => idToText(character + num);
    //eg. getCellValuesInCharRangeForRow("A", "C", 1) will return [idToText("A1"), idToText("B1"), idToText("C1")]
    //charRange("A", "C") will return ["A", "B", "C"]
    //["A", "B", "C"].map(elemValue(1)) will return [idToText("A1"), idToText("B1"), idToText("C1")]
    //if value of A1 is 5, B1 is 10 and C1 is 15,  [idToText("A1"), idToTe
        // xt("B1"), idToText("C1")] will evaluate to the values of cells A1, B1, and C1 eg. [5, 10, 15]
    //so getCellValuesInCharRangeForRow("A", "C", 1) will return [5, 10, 15]

    const getCellValuesInCharRangeForRow = (character1,character2,num) => charRange(character1, character2).map(elemValue(num));
    //cellRangesReplacedWithValues will replace ranges like "A1:C3" with the values of the cells in that range
    //eg. if A1=5, B1=10, C1=15, A2=20, B2=A1+B1 , C2=30, A3=35, B3=40, C3=45
    //then cellRangesReplacedWithValues will replace "A1:C3" with "5,10,15,20,"A1+B1",30,35,40,45"

    //replace() assigns the matched groups to char1, num1, char2, num2 thanks to grouping parentheses in the regex
    //eg. for "A1:C3", char1 becomes "A", num1 becomes "1", char2 becomes "C", num2 becomes "3"
    //rangeFromString(num1, num2) becomes rangeFromString("1", "3") which is [1, 2, 3]
        //now [1, 2, 3].map(num => getCellValuesInCharRangeForRow("A", "C", num)) becomes
        //[getCellValuesInCharRangeForRow("A", "C", 1), getCellValuesInCharRangeForRow("A", "C", 2), getCellValuesInCharRangeForRow("A", "C", 3)]
        //which is [[idToText("A1"), idToText("B1"), idToText("C1")],
        //          [idToText("A2"), idToText("B2"), idToText("C2")],
        //          [idToText("A3"), idToText("B3"), idToText("C3")]]
        //if A1=5, B1=10, C1=15, A2=20, B2=A1 + B1, C2=30, A3=35, B3=40, C3=45
        //it becomes [[5, 10, 15], [20, "A1+B1", 30], [35, 40, 45]]
    //so rangeFromString(num1, num2).map(num => getCellValuesInCharRangeForRow(char1, char2, num))
    //will return [[5, 10, 15], [20, "A1+B1", 30], [35, 40, 45]]


    //finally flat() will flatten the array to [5, 10, 15, 20, "A1+B1", 30, 35, 40, 45]
    //so "A1:C3" will be replaced with "5,10,15,20,"A1+B1",30,35,40,45"
        //if any of the cells are empty it will return NaN which will be handled by the spreadsheet functions like SUM
        //eg. if A1=5, B1=10, C1=15, A2=20, B2=25, C2=30, A3=35, B3="", C3=45
        //it becomes [[5, 10, 15], [20, 25, 30], [35, NaN, 45]]
        //finally flat() will flatten the array to [5, 10, 15, 20, 25, 30, 35, NaN, 45]
        //so "A1:C3" will be replaced with "5,10,15,20,25,30,35,NaN,45"
        // returns "5,10,15,20,25,30,35,NaN,45" as a string
    //but if B2 is "A1+B1" it will not evaluate it here, it will be handled in the next step when cell references are replaced with their values


    const cellRangesReplacedWithValues = x.replace(rangeRegex, (_match, char1, num1, char2, num2) => rangeFromString(num1, num2).map(num =>getCellValuesInCharRangeForRow(char1, char2, num)).flat().join(","));
    //regex to match cell references like A1, B2, C3 etc.
    const cellRegex = /[A-J][1-9][0-9]?/gi;
    //replace cell references with their values
    //eg. cellRangesReplacedWithValues is now "5,10,15,20,"A1+B1",30,35,40,45"
    //cellReferencesReplaced will replace "A1" with 5, "B1" with 10 and in this case thats it
    //so cellReferencesReplaced will be "5,10,15,20,"5+10",30,35,40,45"
    //if there are more cell references like "A2" or "B3" they will also be replaced with their values
    //if any of the referenced cells are empty it will return NaN which will be handled by the spreadsheet functions
    const cellReferencesReplaced = cellRangesReplacedWithValues.replace(cellRegex, match => idToText(match.toUpperCase()));
    //apply functions to the expanded cell references
    //eg. cellReferencesReplaced is now "5,10,15,20,"5+10",30,35,40,45"
    //appliedSpreadsheetFunctions will replace "5+10" with "15"
    //so appliedSpreadsheetFunctions will be "5,10,15,20,15,30,35,40,45"
    //if there are more functions like "SUM(1,2,3)" they will also be replaced with their values
    //returns "5,10,15,20,15,30,35,40,45" as a string
    const appliedSpreadsheetFunctions = applyFunction(cellReferencesReplaced);
    //if appliedSpreadsheetFunctions is same as x it means there are no more functions to evaluate
    //so we return appliedSpreadsheetFunctions
    //if appliedSpreadsheetFunctions is different from x it means there are still functions to evaluate
    //so we call evalFormula again with appliedSpreadsheetFunctions
    //this handles nested functions and cell references
    //eg. if appliedSpreadsheetFunctions is "5,10,15,20,"A1+B1",30,35,40,45"
    //it will call evalFormula again with "5,10,15,20,"A1+B1",30,35,40,45"
    //which will replace "A1+B1" with "15" resulting in "5,10,15,20,15,30,35,40,45"
    //if there are no more functions or cell references it will return the final value as a string
    return appliedSpreadsheetFunctions === x ? appliedSpreadsheetFunctions : evalFormula(appliedSpreadsheetFunctions, cells);
}

//onload, create a 10x99 grid of input cells labeled A-J and 1-99
//eg. A1, A2, A3 ... A99
//     B1, B2, B3 ... B99
//     ... J1, J2, J3 ... J99
//each input cell has an onchange event that calls the update function
//the update function evaluates the formula in the cell and updates its value
//if the formula starts with '=' it is treated as a formula
window.onload = () => {
    const container = document.getElementById("container");
    const createLabel = (name) => {
        const label = document.createElement("div");
        label.className = "label";
        label.textContent = name;
        container.appendChild(label);
    }
    const letters = charRange("A", "J");
    letters.forEach(createLabel);
    range(1, 99).forEach(number => {
        createLabel(number);
        letters.forEach(letter => {
            const input = document.createElement("input");
            input.type = "text";
            input.id = letter + number;
            input.ariaLabel = letter + number;
            input.onchange = update;
            container.appendChild(input);
        })
    })
}
// Updates the cell value when it changes
// If the value starts with '=', it evaluates the formula and updates the cell value
// It also prevents circular references by checking if the cell id is included in the formula
//eg. if cell A1 has value 5 and cell A2 has value 10
//then changing cell A3 to "=A1+A2" will update its value to "15"
//if cell A1 has value "=A3" and cell A3 has value "=A1" it will prevent the circular reference and not update the value
//if cell A1 has value "=A1+5" it will prevent the circular reference and not update the value
const update = event => {
    const element = event.target;
    const value = element.value.replace(/\s/g, "");
    if (!value.includes(element.id) && value.startsWith('=')) {
        element.value = evalFormula(value.slice(1), Array.from(document.getElementById("container").children));
    }
}

//slice is used to remove the leading '=' from the formula before passing it to evalFormula

//example when one cell is updated
//1. user changes cell A3 to "=A1+A2" while A1=5 and A2=10
//2. onchange event triggers update function with event.target as cell A3
//3. element becomes cell A3, value becomes "=A1+A2"
//4. value does not include element.id (A3) and starts with '=' so it enters the if block
//Array.from(document.getElementById("container").children) creates an array of all cell elements in the container
//it is 2D array with each element having id and value properties
//from now onwards we refer to this array as cells
//5. evalFormula("A1+A2", cells) is called
//6. in evalFormula, idToText is a function that takes a cell id and returns the value of that cell from cells array
//7. rangeRegex does not match anything in "A1+A2" so cellRangesReplacedWithValues remains "A1+A2"
//8. cellRegex matches "A1" and "A2"
//9. cellReferencesReplaced becomes "5+10" after replacing "A1" with 5 and "A2" with 10
//10. applyFunction("5+10") is called
//11. in applyFunction, highPrecedence("5+10") does not match anything so noHigh remains "5+10"
//12. infixEval("5+10", /([\d.]+)([+-])([\d.]+)/) matches "5+10"
//13. infixEval replaces "5+10" with "15" using the infixToFunction mapping for '+'
//14. str2 becomes "15"
//15. functionCall does not match anything in "15" so appliedSpreadsheetFunctions remains "15"
//16. appliedSpreadsheetFunctions ("15") is same as x ("A1+A2") so evalFormula returns "15"
//17. element.value is updated to "15" in the update function
//18. cell A3 now has value "15"

