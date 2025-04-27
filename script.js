let commodities = [];
let chart;

document.addEventListener('DOMContentLoaded', function () {
   fetch('getCommodities.php')
      .then(response => response.json())
      .then(data => {
         commodities = data.sort((a, b) => a.name.localeCompare(b.name));
         populateDropdown();
      });

   document.getElementById('commoditySelect').addEventListener('change', function () {
      if (this.value) {
         addWidget(this.value);
         this.value = "";
      }
   });
});

function populateDropdown() {
   const select = document.getElementById('commoditySelect');
   commodities.forEach(commodity => {
      const option = document.createElement('option');
      option.value = commodity.code;
      option.textContent = commodity.name;
      select.appendChild(option);
   });
}

function addWidget(code) {
   if (document.getElementById(code)) return; // Avoid duplicates
   const commodity = commodities.find(c => c.code === code);
   const widget = new CommodityWidget(commodity);
   document.getElementById('dashboard').appendChild(widget.element);
}

function CommodityWidget(commodity) {
   this.commodity = commodity;
   this.element = document.createElement('div');
   this.element.className = 'widget';
   this.element.id = commodity.code;
   this.element.innerHTML = `
        <h3>${commodity.name}</h3>
        <button class="graphBtn">Graph</button>
        <button class="removeBtn">Remove</button>
    `;

   this.element.querySelector('.graphBtn').addEventListener('click', () => this.showGraph());
   this.element.querySelector('.removeBtn').addEventListener('click', () => this.removeWidget());
}

CommodityWidget.prototype.showGraph = function () {
   fetch(`getPrices.php?symbol=${this.commodity.code}`)
      .then(response => response.json())
      .then(data => {
         const timeSeries = data["Monthly Time Series"];
         const labels = Object.keys(timeSeries).reverse();
         const prices = labels.map(date => parseFloat(timeSeries[date]["4. close"]));

         if (chart) chart.destroy();
         const ctx = document.getElementById('priceChart').getContext('2d');
         chart = new Chart(ctx, {
            type: 'line',
            data: {
               labels: labels,
               datasets: [{
                  label: this.commodity.name,
                  data: prices,
                  borderColor: 'blue',
                  fill: false
               }]
            }
         });
      });
};

CommodityWidget.prototype.removeWidget = function () {
   this.element.remove();
};
