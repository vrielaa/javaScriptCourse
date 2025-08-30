let price = 1.87;
let cid = [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100]
];

const currencyUnits = [
    { name: 'ONE HUNDRED', value: 100 },
    { name: 'TWENTY', value: 20 },
    { name: 'TEN', value: 10 },
    { name: 'FIVE', value: 5 },
    { name: 'ONE', value: 1 },
    { name: 'QUARTER', value: 0.25 },
    { name: 'DIME', value: 0.1 },
    { name: 'NICKEL', value: 0.05 },
    { name: 'PENNY', value: 0.01 }
];
const purchaseBtn = document.getElementById('purchase-btn');
const priceInput = document.getElementById('cash');
const resetChangeDue = () => {
    changeDueDisplay.textContent = 'Change Due: $0.00';
}


const totalPriceDisplay = document.querySelector('.total-text');
const changeDueDisplay = document.getElementById('change-due');
totalPriceDisplay.textContent = `Total Price: $${price.toFixed(2)}`;
const round2 = x => Math.round(x * 100) / 100;
const displayCID = () => {
    const cidContainer = document.getElementById('change-in-drawer');
    cid.forEach((unit) => {
        const unitDiv = document.createElement('div');
        unitDiv.classList.add('cid-unit');
        unitDiv.textContent = `${unit[0]}: $${unit[1]}`;
        cidContainer.appendChild(unitDiv);
    });
}

displayCID();

const updateCIDDisplay = () => {
    const cidContainer = document.getElementById('change-in-drawer');
    cidContainer.innerHTML = '';
    displayCID();
}

const isInputAmountEnough = (input, price) => {
    const inputAmount = parseFloat(input);
    return round2(inputAmount) >= round2(price);
};


const getChange = (input) => {
    const changeObj = {};

    const inputAmount = parseFloat(input);
    let changeDue = round2(inputAmount - parseFloat(price));
    let totalCID = round2(cid.reduce((acc, curr) => acc + curr[1], 0));
    const tempCID = cid.map(arr => [...arr]);

    if (round2(totalCID) < round2(changeDue)) {
        return { status: 'INSUFFICIENT_FUNDS', change: [] };
    } else if (round2(totalCID) === round2(changeDue)) {
        // Zwróć nominały w kolejności malejącej (tylko > 0), bo testy tego chcą
        const cidMap = new Map(cid);
        const closedArr = currencyUnits
            .map(u => [u.name, round2(cidMap.get(u.name) || 0)])
            .filter(([_, amt]) => amt > 0);
        return { status: 'CLOSED', change: closedArr };
    }

    currencyUnits.forEach((unit) => {
        const idx = tempCID.findIndex(c => c[0] === unit.name);
        if (idx === -1) return;

        const available = tempCID[idx][1];
        if (available <= 0 || changeDue <= 0) return;

        const needUnits = Math.floor(changeDue / unit.value);
        const haveUnits = Math.floor(available / unit.value);
        const maxUnitAvailable = Math.min(needUnits, haveUnits);

        if (maxUnitAvailable > 0) {
            const used = round2(maxUnitAvailable * unit.value);
            changeObj[unit.name] = (changeObj[unit.name] || 0) + used;
            changeDue = round2(changeDue - used);
            tempCID[idx][1] = round2(tempCID[idx][1] - used);
        }
    });

    if (round2(changeDue) > 0) {
        return { status: 'INSUFFICIENT_FUNDS', change: [] };
    } else {
        for (let i = 0; i < cid.length; i++) {
            cid[i][1] = round2(tempCID[i][1]);
        }
        updateCIDDisplay();
        const ordered = currencyUnits
            .filter(u => changeObj[u.name] > 0)
            .map(u => [u.name, round2(changeObj[u.name])]);     // high -> low
        return { status: 'OPEN', change: ordered };
    }
};

purchaseBtn.addEventListener('click', () => {
    const val = priceInput.value;

    if (val === '' || isNaN(val) || parseFloat(val) <= 0) {
        // testy tego nie sprawdzają, ale nie psujemy
        alert('Please enter a valid amount.');
        return;
    }

    // 7–8: gdy cash < price -> dokładny alert
    if (!isInputAmountEnough(val, price)) {
        alert('Customer does not have enough money to purchase the item');
        return;
    }

    const tendered = round2(parseFloat(val));
    const p = round2(price);

    // 9–10: gdy cash === price -> dokładny tekst w #change-due
    if (tendered === p) {
        changeDueDisplay.textContent = 'No change due - customer paid with exact cash';
        return;
    }

    // cash > price -> policz resztę
    const result = getChange(val);


    const formatAmount = a => parseFloat(a.toFixed(2)); // daje 0.5, 0.2, 0.04
    const formatLine = (status, arr) => {
        if (!arr || arr.length === 0) return `Status: ${status}`;

        const tail = arr.map(([n, a]) => `${n}: $${formatAmount(a)}`).join(' ');
        return `Status: ${status} ${tail}`;
    };

    if (result.status === 'OPEN') {
        changeDueDisplay.textContent = formatLine('OPEN', result.change);
    } else if (result.status === 'CLOSED') {
        changeDueDisplay.textContent = formatLine('CLOSED', result.change);
    } else {
        // INSUFFICIENT_FUNDS
        changeDueDisplay.textContent = 'Status: INSUFFICIENT_FUNDS';
    }
});


priceInput.addEventListener('input', resetChangeDue);