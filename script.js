let commodities = [];
let chart;
let chartData = {
   labels: [],
   datasets: []
};

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

   // Initialize Chart
   const ctx = document.getElementById('priceChart').getContext('2d');
   chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
         responsive: true,
         plugins: {
            legend: {
               position: 'top',
            },
            title: {
               display: true,
               text: 'Commodity Prices Over Time'
            }
         }
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
   if (document.getElementById(code)) return; // Avoid duplicate widgets
   const commodity = commodities.find(c => c.code === code);
   const widget = new CommodityWidget(commodity);
   document.getElementById('dashboard').appendChild(widget.element);
}

function CommodityWidget(commodity) {
   this.commodity = commodity;
   this.element = document.createElement('div');
   this.element.className = 'widget';
   this.element.id = commodity.code;
   this.addedToGraph = false; // Track if already added

   this.element.innerHTML = `
        <h3>${commodity.name}</h3>
        <div class="widget-buttons">
            <button class="graphBtn">Add to Graph</button>
            <button class="removeBtn">Remove Widget</button>
        </div>
    `;

   this.element.querySelector('.graphBtn').addEventListener('click', () => this.addToGraph());
   this.element.querySelector('.removeBtn').addEventListener('click', () => this.removeWidget());
}

CommodityWidget.prototype.addToGraph = function () {
   if (this.addedToGraph) {
      alert(this.commodity.name + " is already added to the graph!");
      return;
   }
   fetch(`getPrices.php?symbol=${this.commodity.code}`)
      .then(response => response.json())
      .then(data => {
         const timeSeries = data['data'];
         if (!timeSeries) {
            alert("No data available for " + this.commodity.name);
            return;
         }

         const labels = [];
         const prices = [];

         timeSeries.forEach(point => {
            if (isNaN(point.value)) return; // Skip invalid data
            labels.push(point.date);
            prices.push(point.value);
         });

         if (chartData.labels.length === 0) {
            chartData.labels = labels;
         }

         const color = getRandomColor();

         chartData.datasets.push({
            label: this.commodity.name,
            data: prices,
            borderColor: color,
            backgroundColor: color + '80', // semi-transparent
            fill: true
         });

         this.addedToGraph = true; // Mark as added
         chart.update();
      });
};

CommodityWidget.prototype.removeWidget = function () {
   this.element.remove();

   // Remove dataset from chart
   const datasetIndex = chartData.datasets.findIndex(d => d.label === this.commodity.name);
   if (datasetIndex !== -1) {
      chartData.datasets.splice(datasetIndex, 1);
      chart.update();
   }
};

function getRandomColor() {
   const letters = '0123456789ABCDEF';
   let color = '#';
   for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
   }
   return color;
}
