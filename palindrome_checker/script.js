
const checkButton = document.getElementById('check-btn');
const textInput = document.getElementById('text-input');
const resultDiv = document.getElementById('result');
resultDiv.style.display = "none";
const resultText = document.getElementById('result-text');

checkButton.addEventListener("click",  () => {
    if(textInput.value.trim() === "") {
        alert("Please input a value");
        return;
    }else {
        const text = textInput.value.trim().toLowerCase();
        const noWhitespaceText = text.replace(/\s+/g, '');
        const punctuationRegex = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;
        const cleanText = noWhitespaceText.replace(punctuationRegex, '');
        const reversedText = cleanText.split('').reverse().join('');

        if(cleanText === reversedText) {
            resultText.innerHTML = `"${textInput.value}" is a palindrome.   <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="green" class="bi bi-check" viewBox="0 0 16 16" style="vertical-align: middle;">
  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
</svg>`;
            resultDiv.style.display = "block";
        } else {
            resultText.innerHTML = `"${textInput.value}" is <span style="color: red;">not</span> a palindrome.`;
            resultDiv.style.display = "block";

        }
    }
})