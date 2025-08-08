import { countryList } from "./code.js";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Fill the dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name == "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name == "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Add event listener to update flag image on change
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// ✅ FIXED: Typo (was: upadteFlag)
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// ✅ Conversion logic
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amountInput = document.querySelector(".amount input");
  let amountValue = parseFloat(amountInput.value);

  // Validate amount
  if (isNaN(amountValue) || amountValue < 1) {
    amountValue = 1;
    amountInput.value = "1";
  }

  
   try {
      let response = await fetch(`https://v6.exchangerate-api.com/v6/8c7b369ee381a23f7ef66d11/latest/${fromCurr.value}`);
      let data = await response.json();

    let rate = data.conversion_rates[toCurr.value];
    let finalAmount = amountValue * rate;

    updateMsg(amountValue, finalAmount);
  } catch (error) {
    msg.innerText = `Failed to fetch conversion. Try again later.`;
    console.error("Conversion Error:", error);
  }
});

// ✅ Result display
const updateMsg = (enterAmount, finalAmount) => {
  const resultText = `${enterAmount} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  msg.innerHTML = resultText;
};
