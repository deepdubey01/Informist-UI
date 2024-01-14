var chipContainer, fruitInput, commaSeparatedOutput; // Declare variables in the global scope


function addChip() {
    var chipValue = fruitInput.value.trim();
    if (chipValue === '') {
        return;
    }

    var chipElement = document.createElement('div');
    chipElement.className = 'badge badge-secondary example-chip';
    chipElement.textContent = chipValue;
    var closeButton = document.createElement('button');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', function () {
        removeChip(chipElement);
    });


    fruitInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addChip();
        }
    });

    chipElement.appendChild(closeButton);
    chipContainer.appendChild(chipElement);
    fruitInput.value = '';
    updateCommaSeparatedInput();
}
function removeChip(chipElement) {
    chipContainer.removeChild(chipElement);
    updateCommaSeparatedInput();
}

function addChipList() {
    var commaSeparatedFruits = Array.from(chipContainer.children).map(function (chipElement) {
        return chipElement.textContent.replace('×', '').trim();
    }).join(', ');

    console.log(commaSeparatedFruits);
}

function updateCommaSeparatedInput() {
    var commaSeparatedFruits = Array.from(chipContainer.children).map(function (chipElement) {
        return chipElement.textContent.replace('×', '').trim();
    }).join(', ');
    commaSeparatedOutput.textContent = "Comma-separated output: " + commaSeparatedFruits;
}

document.addEventListener("DOMContentLoaded", function () {
    chipContainer = document.querySelector('#chipContainer');
    fruitInput = document.querySelector('#fruitInput');
    commaSeparatedOutput = document.querySelector('#commaSeparatedOutput');
});

function addChipbutton() {
    addChip();
}


