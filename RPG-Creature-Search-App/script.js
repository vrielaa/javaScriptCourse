const creatureName = document.getElementById('creature-name');
const creatureId = document.getElementById('creature-id');
const creatureWeight = document.getElementById('weight');
const creatureHeight = document.getElementById('height');
const creatureTypes = document.getElementById('types');
const creatureHp = document.getElementById('hp');
const creatureAttack = document.getElementById('attack');
const creatureDefense = document.getElementById('defense');
const creatureSpecialAttack = document.getElementById('special-attack');
const creatureSpecialDefense = document.getElementById('special-defense');
const creatureSpeed = document.getElementById('speed');

const searchBtn = document.getElementById('search-button');
const userInput = document.getElementById('search-input');



searchBtn.addEventListener('click', () => {

    const input = userInput.value.trim();

    if(input === '' || input == null ) {
        alert('Please enter a creature name or ID');
        return;
    }
    else if(isDigit(input)){
        const creature = creatureDataArr.find(c => c.id === parseInt(input));
        if(creature){
            fetch(`${urlByIdOrName.replace('{name-or-id}', creature.id)}`).then(
                (res) => res.json().then((data) => {
                    currentCreature = data;
                    displayCreature(currentCreature);
                })).catch(() => {
                    alert('There was an error loading the creature data');
                }
            )

        } else {
            alert('Creature not found');
        }


    }else{
        const creature = creatureDataArr.find(c => c.name.toLowerCase() === input.toLowerCase());
        if(creature){
            fetch(`${urlByIdOrName.replace('{name-or-id}', creature.name)}`).then(
                (res) => res.json().then((data) => {
                    currentCreature = data;
                    displayCreature(currentCreature);
                })).catch(() => {
                    alert('There was an error loading the creature data');
                }
            )
        } else {
            alert('Creature not found');
        }
    }

});

const urlAll = 'https://rpg-creature-api.freecodecamp.rocks/api/creatures'
const urlByIdOrName = 'https://rpg-creature-api.freecodecamp.rocks/api/creature/{name-or-id}';
let creatureDataArr = [];
let currentCreature = {}
fetch(urlAll)
    .then((res) => res.json())
    .then((data) => {
        creatureDataArr = data;
        console.log(creatureDataArr);
    })
    .catch((err) => {
        alert('There was an error loading the creature data');
    });



const isDigit = (string) => {
    return /^\d+$/.test(string);
}

// Wyczyść pola przed wyświetleniem nowego stwora
const clearCreatureDisplay = () => {
    creatureName.textContent = '';
    creatureId.textContent = '';
    creatureWeight.textContent = '';
    creatureHeight.textContent = '';
    creatureTypes.innerHTML = '';
    creatureHp.textContent = '';
    creatureAttack.textContent = '';
    creatureDefense.textContent = '';
    creatureSpecialAttack.textContent = '';
    creatureSpecialDefense.textContent = '';
    creatureSpeed.textContent = '';
};

const displayCreature = (creature) => {
    clearCreatureDisplay();


            // Nazwa
            creatureName.textContent = creature.name.toUpperCase();

            // ID
            creatureId.textContent = `#${creature.id}`;

            // Waga i wzrost (bez etykiet)
            creatureWeight.textContent = `Weight: ${creature.weight}`;
            creatureHeight.textContent = `Height: ${creature.height}`;

            // Typy jako osobne elementy
            creatureTypes.innerHTML = '';
            currentCreature.types.forEach(t => {
                const span = document.createElement('span');
                span.textContent = t.name.toUpperCase();
                creatureTypes.appendChild(span);
            });

            // Statystyki (same liczby)
            // Statystyki z nazwami
    creatureHp.innerHTML = `<span class="stat-row"><span class="stat-name">HP:</span> ${creature.stats[0].base_stat}</span>`;
    creatureAttack.innerHTML = `<span class="stat-row"><span class="stat-name">Attack:</span> ${creature.stats[1].base_stat}</span>`;
    creatureDefense.innerHTML = `<span class="stat-row"><span class="stat-name">Defense:</span> ${creature.stats[2].base_stat}</span>`;
    creatureSpecialAttack.innerHTML = `<span class="stat-row"><span class="stat-name">Special Attack:</span> ${creature.stats[3].base_stat}</span>`;
    creatureSpecialDefense.innerHTML = `<span class="stat-row"><span class="stat-name">Special Defense:</span> ${creature.stats[4].base_stat}</span>`;
    creatureSpeed.innerHTML = `<span class="stat-row"><span class="stat-name">Speed:</span> ${creature.stats[5].base_stat}</span>`;

};
