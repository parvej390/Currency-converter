
const BASE_URL =
    "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate currency dropdowns
for (const select of dropdowns) {
    for (const currCode in countryList) {
        const newOption = document.createElement("option");

        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update country flag
const updateFlag = (element) => {
    const currCode = element.value;
    const countryCode = countryList[currCode];

    const img = element.parentElement.querySelector("img");

    if (countryCode) {
        img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
        img.alt = `${currCode} flag`;
    }
};

// Update both default flags
updateFlag(fromCurr);
updateFlag(toCurr);

// Fetch currency rate and convert
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    const amountInput = document.querySelector(".amount input");
    let amtVal = Number(amountInput.value);

    if (!Number.isFinite(amtVal) || amtVal <= 0) {
        amtVal = 1;
        amountInput.value = "1";
    }

    const from = fromCurr.value.toLowerCase();
    const to = toCurr.value.toLowerCase();

    // Same currency: no API request needed
    if (from === to) {
        msg.innerText =
            `${amtVal} ${from.toUpperCase()} = ${amtVal.toFixed(2)} ${to.toUpperCase()}`;
        return;
    }

    const URL = `${BASE_URL}/${from}.json`;

    try {
        msg.innerText = "Getting exchange rate...";

        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        const rate = data[from]?.[to];

        if (typeof rate !== "number" || !Number.isFinite(rate)) {
            throw new Error("Exchange rate not found for this currency.");
        }
        const result = amtVal * rate;

        msg.innerText =
            `${amtVal} ${from.toUpperCase()} = ${result.toFixed(2)} ${to.toUpperCase()}`;

    } catch (error) {
        console.error("Currency API Error:", error);

        msg.innerText =
            "Exchange rate load nahi hua. Please try again.";
    }
});

