const convertButton = document.getElementById('convert-btn');
const inputField = document.getElementById('number');
const outputField = document.getElementById('output');
const outputBox = document.querySelector('.output-box');

const romanNumerals = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
];
const isValidInput = (val) => {
    return !isNaN(val) && val !== ''; // Check if input is a valid number and not empty
}

const convertToRoman = (num) => {
    let result = '';
    for(const { value, numeral } of romanNumerals) {
        while (num >= value) {
            result += numeral;
            num -= value;
        }
    }
    return result;
}
convertButton.addEventListener('click',
    () =>
    {
    const inputValue = inputField.value.trim();
    const clearedInput = parseInt(inputValue);
    outputBox.classList.remove("hidden", "alert");
        if (!isValidInput(clearedInput)) {

            outputBox.classList.add("alert");
            outputField.textContent = 'Please enter a valid number.';
        } else if (clearedInput < 1) {
            outputBox.classList.add("alert");
            outputField.textContent = 'Please enter a number greater than or equal to 1';
        } else if (clearedInput > 3999) {
            outputBox.classList.add("alert");
            outputField.textContent = 'Please enter a number less than or equal to 3999.';
        } else {
            outputBox.classList.remove("alert");
            outputField.textContent = convertToRoman(clearedInput);
        }

    });