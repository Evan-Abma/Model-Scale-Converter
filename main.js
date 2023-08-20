const scaleDropdown = document.getElementById('scale');
const feetInput = document.getElementById('feet');
const inchesInput = document.getElementById('inches');
const fractionsInput = document.getElementById('fractions');
const convertedValueInput = document.getElementById('convertedValue');
const outputValueInput = document.getElementById('outputValue');
const outputUnitDropdown = document.getElementById('outputUnit');

function fractionToDecimal(fraction) {
    const [numerator, denominator] = fraction.split("/").map(Number);

    // Return the result of the division or 0 if not a valid fraction
    return denominator ? numerator / denominator : 0;
}

function reverseCalculate() {
    // Convert the model size to mm based on the selected output unit
    let modelSizeInMM;
    switch (outputUnitDropdown.value) {
        case 'mm':
            modelSizeInMM = parseFloat(outputValueInput.value);
            break;
        case 'cm':
            modelSizeInMM = parseFloat(outputValueInput.value) * 10;
            break;
        case 'm':
            modelSizeInMM = parseFloat(outputValueInput.value) * 1000;
            break;
        case 'inches':
            modelSizeInMM = parseFloat(outputValueInput.value) * 25.4;
            break;
        case 'decimal-ft':
            modelSizeInMM = parseFloat(outputValueInput.value) * 12 * 25.4;
            break;
        default:
            return;  // If the output unit is not recognized, just exit
    }

    if (isNaN(modelSizeInMM)) return;  // Return if not a valid number

    // Convert to real-life size in inches
    let realLifeSizeInches = (modelSizeInMM / parseFloat(scaleDropdown.value)) * 12;

    // Convert the real-life size from inches to feet, inches, and fractions
    let feet = Math.floor(realLifeSizeInches / 12);
    let inches = Math.floor(realLifeSizeInches % 12);
    let fractions = (realLifeSizeInches - (feet * 12 + inches)).toFixed(2); // As decimal fraction

    // Convert the decimal fraction to a common fraction (out of 16 for the desired precision)
    let fraction = Math.round(fractions * 16) + "/16";

    // Set the values to the input cells
    feetInput.value = feet;
    inchesInput.value = inches;
    fractionsInput.value = fraction === "0/16" ? "" : fraction; // Do not display "0/16"
}

const calculate = () => {
    // Get scale factor
    const scaleFactor = parseFloat(scaleDropdown.value);

    // Convert real-life size to mm
    const feet = parseFloat(feetInput.value) || 0;
    const inches = parseFloat(inchesInput.value) || 0;
    const fractions = fractionsInput.value ? fractionToDecimal(fractionsInput.value) : 0;
    const totalInches = (feet * 12) + inches + fractions;
    const realLifeMm = totalInches * 25.4;

    // Convert realLifeMm to model size and round it to 4 decimal places
    const modelSize = parseFloat(((realLifeMm / 25.4 / 12) * scaleFactor).toFixed(4));

    // Calculate output value
    switch (outputUnitDropdown.value) {
        case 'mm':
            outputValueInput.value = modelSize;
            break;
        case 'cm':
            outputValueInput.value = (modelSize / 10).toFixed(3);
            break;
        case 'm':
            outputValueInput.value = (modelSize / 1000).toFixed(3);
            break;
        case 'inches':
            outputValueInput.value = (modelSize / 25.4).toFixed(6);
            break;
        case 'decimal-ft':
            outputValueInput.value = (modelSize / 25.4 / 12).toFixed(4);
            break;
        default:
            break;
    }
};

// Event listeners
feetInput.addEventListener('input', calculate);
inchesInput.addEventListener('input', calculate);
fractionsInput.addEventListener('input', calculate);
scaleDropdown.addEventListener('change', calculate);
outputUnitDropdown.addEventListener('change', calculate);

calculate(); // Initial calculation

const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', function() {
    feetInput.value = '';
    inchesInput.value = '';
    fractionsInput.value = '';
    outputValueInput.value = '';
    scaleDropdown.selectedIndex = 0; // Set back to default scale (HO)
    outputUnitDropdown.selectedIndex = 0; // Set back to default unit (mm)
});
