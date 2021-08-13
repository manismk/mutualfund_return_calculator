var sliderPurchaseInput = document.querySelector("#purchaseInput");
var purchase = document.querySelector("#purchase");
var sliderRateInput = document.querySelector("#rateInput");
var rate = document.querySelector("#rate");
var sliderYearsInput = document.querySelector("#yearsInput");
var years = document.querySelector("#years");
var invested = document.querySelector("#invested");
var expected = document.querySelector("#expected");
var total = document.querySelector("#total");
var chart;
var initialLoad = true;

var xValues = ["Invested", "Expected Returns"];
var yValues = [1, 1];
var barColors = ["#b91d47", "#00aba9"];

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
  updateslider();
};

function updateslider(slider, spanName) {
  if (slider) {
    spanName.innerText = slider.value;
    var value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    var color = `linear-gradient(to right, red 0%, red ${value}%, grey ${value}%, grey 100%)`;
    slider.style.background = color;
  }

  var purchaseValue = sliderPurchaseInput.value;
  var rateValue = sliderRateInput.value;
  var yearsValue = sliderYearsInput.value;
  var months = yearsValue * 12;
  var monthRate = rateValue / (100 * 12);
  var investedAmount = purchaseValue * months;

  //FV = P [ (1+i)^n-1 ] * (1+i)/i
  var sip =
    purchaseValue *
    (Math.pow(1 + monthRate, months) - 1) *
    ((1 + monthRate) / monthRate);
  sip = Math.round(sip);

  var ExpectedAmount = sip - investedAmount;

  invested.innerText = numberConvertToIndian(investedAmount);
  expected.innerText = numberConvertToIndian(ExpectedAmount);
  total.innerText = numberConvertToIndian(sip);

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
