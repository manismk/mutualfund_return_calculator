var sliderPurchaseInput = document.querySelector("#purchaseInput");
var purchase = document.querySelector("#purchase");
var sliderRateInput = document.querySelector("#rateInput");
var rate = document.querySelector("#rate");
var sliderYearsInput = document.querySelector("#yearsInput");
var years = document.querySelector("#years");
var invested = document.querySelector("#invested");
var expected = document.querySelector("#expected");
var total = document.querySelector("#total");
var investType = document.querySelector("#investType");
var investLabel = document.querySelector("#investLabel");
var chart;
var initialLoad = true;

var xValues = ["Invested", "Expected Returns"];
var yValues = [1, 1];
var barColors = ["#34D399", "#047857"];

sliderPurchaseInput.oninput = function () {
  updateslider(sliderPurchaseInput, purchase);
};
sliderRateInput.oninput = function () {
  updateslider(sliderRateInput, rate);
};
sliderYearsInput.oninput = function () {
  updateslider(sliderYearsInput, years);
};
window.onload = function () {
  sliderPurchaseInput.value = 15000;
  sliderRateInput.value = 15;
  sliderYearsInput.value = 15;
  updateslider(sliderPurchaseInput, purchase);
  updateslider(sliderRateInput, rate);
  updateslider(sliderYearsInput, years);
};

for (var i = 0, max = investType.length; i < max; i++) {
  investType[i].onclick = function () {
    if (this.value === "sip") {
      investLabel.innerHTML = "Monthly Invesment";
      barColors = ["#6ee7b7", "#047857"];
      document.documentElement.className = "green-theme";
    } else {
      investLabel.innerHTML = "Onetime Invesment";
      barColors = ["#fca5a5", "#b91c1c"];
      document.documentElement.className = "red-theme";
    }
    updateslider();
  };
}
function updateslider(slider, spanName) {
  if (slider) {
    spanName.innerText =
      spanName.id === "purchase"
        ? numberConvertToIndian(slider.value)
        : slider.value;
    var value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    var color = `linear-gradient(to right, var(--slider-dark) 0%, var(--slider-dark) ${value}%, var(--slider-light) ${value}%, var(--slider-light) 100%)`;
    slider.style.background = color;
  }
  var type = investType.elements[`invesmentType`].value;

  var purchaseValue = sliderPurchaseInput.value;
  var rateValue = sliderRateInput.value;
  var yearsValue = sliderYearsInput.value;
  var months = yearsValue * 12;
  var monthRate = rateValue / (100 * 12);
  var sip =
    purchaseValue *
    (Math.pow(1 + monthRate, months) - 1) *
    ((1 + monthRate) / monthRate);
  var lumpsum = Math.round(
    Math.pow(1 + rateValue / 100, yearsValue) * purchaseValue
  );
  var totalAmount = 0;
  if (type === "sip") {
    var investedAmount = purchaseValue * months;
    sip = Math.round(sip);
    totalAmount = sip;
  } else {
    var investedAmount = purchaseValue;
    totalAmount = lumpsum;
  }

  //FV = P [ (1+i)^n-1 ] * (1+i)/i
  var ExpectedAmount = totalAmount - investedAmount;
  invested.innerText = numberConvertToIndian(investedAmount);
  expected.innerText = numberConvertToIndian(ExpectedAmount);
  total.innerText = numberConvertToIndian(totalAmount);

  if (!initialLoad) {
    chart.destroy();
  }
  initialLoad = false;

  yValues = [investedAmount, ExpectedAmount];

  var chartContext = document.getElementById("myChart").getContext("2d");

  chart = new Chart(chartContext, {
    type: "pie",
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
          borderColor: ["black", "black"],
        },
      ],
    },
    options: {
      segmentShowStroke: false,
      responsive: true,
    },
  });
}

function numberConvertToIndian(num) {
  num = num.toString();
  var lastThree = num.substring(num.length - 3);
  var otherNumbers = num.substring(0, num.length - 3);
  if (otherNumbers != "") lastThree = "," + lastThree;
  var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return res;
}
