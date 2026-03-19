"use strict";
(function () {
  function hasChartReady() {
    return typeof Chart !== 'undefined'
      && typeof months !== 'undefined'
      && typeof inTotals !== 'undefined'
      && typeof userTotals !== 'undefined'
      && typeof Monthly_Income !== 'undefined'
      && typeof Monthly_Premium_Users !== 'undefined'
      && typeof $ !== 'undefined';
  }

  function renderCharts() {
    if (!hasChartReady()) return false;

    if ($('#lineChart').length > 0) {
      var lineChart = document.getElementById('lineChart').getContext('2d');
      // eslint-disable-next-line no-unused-vars
      var myLineChart = new Chart(lineChart, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: Monthly_Income,
            borderColor: "#1d7af3",
            pointBorderColor: "#FFF",
            pointBackgroundColor: "#1d7af3",
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 4,
            backgroundColor: 'transparent',
            fill: true,
            borderWidth: 2,
            data: inTotals
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            labels: {
              padding: 10,
              fontColor: '#1d7af3',
            }
          },
          tooltips: {
            bodySpacing: 4,
            mode: "nearest",
            intersect: 0,
            position: "nearest",
            xPadding: 10,
            yPadding: 10,
            caretPadding: 10
          },
          layout: {
            padding: {
              left: 15,
              right: 15,
              top: 15,
              bottom: 15
            }
          }
        }
      });
    }

    if ($('#usersChart').length > 0) {
      var usersChart = document.getElementById('usersChart').getContext('2d');
      // eslint-disable-next-line no-unused-vars
      var myUsersChart = new Chart(usersChart, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: Monthly_Premium_Users,
            borderColor: "#1d7af3",
            pointBorderColor: "#FFF",
            pointBackgroundColor: "#1d7af3",
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 4,
            backgroundColor: 'transparent',
            fill: true,
            borderWidth: 2,
            data: userTotals
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            labels: {
              padding: 10,
              fontColor: '#1d7af3',
            }
          },
          tooltips: {
            bodySpacing: 4,
            mode: "nearest",
            intersect: 0,
            position: "nearest",
            xPadding: 10,
            yPadding: 10,
            caretPadding: 10
          },
          layout: {
            padding: {
              left: 15,
              right: 15,
              top: 15,
              bottom: 15
            }
          }
        }
      });
    }

    return true;
  }

  // Turbo Drive may evaluate inline scripts before Chart.js finishes loading.
  // Retry briefly until dependencies are available.
  if (renderCharts()) return;

  var attempts = 0;
  var maxAttempts = 25;
  var delayMs = 80;

  (function retry() {
    attempts += 1;
    if (renderCharts()) return;
    if (attempts >= maxAttempts) return;
    setTimeout(retry, delayMs);
  })();
})();
