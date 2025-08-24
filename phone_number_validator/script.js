

const checkButton = document.getElementById('check-btn');
const clearButton = document.getElementById('clear-btn');
const userInput = document.getElementById('user-input');
const resultDiv = document.getElementById('results-div');



const validatePhoneNumber=(event)=>{
    event.preventDefault();
    const regex = /^(1\s?)?(\(\d{3}\)|\d{3})([\s\-]?)\d{3}([\s\-]?)\d{4}$/;
    // Explanation of the regex:
    // ^ asserts position at start of the string
    // (1\s?)? matches an optional '1' followed by an optional space
    // (\(\d{3}\)|\d{3}) matches either three digits enclosed in parentheses or just three digits
    // ([\s\-]?) matches an optional space or hyphen
    // \d{3} matches exactly three digits
    // ([\s\-]?) matches an optional space or hyphen
    // \d{4} matches exactly four digits
    // $ asserts position at the end of the string
    const resultText = document.createElement('p');
    resultDiv.innerHTML = ''; // Clear previous results
    resultDiv.appendChild(resultText);
    const userPhoneNumber = userInput.value.trim();
    if(userPhoneNumber === ''){
        alert("Please provide a phone number")
        return;
    }
    if(regex.test(userPhoneNumber)){
        resultText.innerText = `Valid US number: ${userInput.value}`;



        resultDiv.style.color = 'yellowgreen';
        resultDiv.classList.remove('hidden');
    }else {
        resultText.innerText = `Invalid US number: ${userInput.value}`;
        resultDiv.style.color = 'red';
        resultDiv.classList.remove('hidden');
    }
}

const clearInput=(event)=>{
    event.preventDefault();
    userInput.value = '';
    resultDiv.innerHTML = '';
    resultDiv.classList.add('hidden');

}
checkButton.addEventListener('click', validatePhoneNumber);
clearButton.addEventListener('click', clearInput);


// 1 555-555-5555
// 1 (555) 555-5555
// 1(555)555-5555
// 1 555 555 5555
// 5555555555
// 555-555-5555
// (555)555-5555