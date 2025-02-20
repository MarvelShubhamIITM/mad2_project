export default {
    template:`
  <div>
    <h1>Summary Dashboard</h1>

    <!-- Professionals vs Customers Pie Chart -->
    <div style="width: 100%; height: 400px; position: relative;">
      <h2>Professionals vs Customers</h2>
      <canvas id="pieChart" style="width: 100%; height: 100%;"></canvas>
    </div>

    <!-- Service Request Statuses Bar Chart -->
    <div style="width: 90%; height: 300px;">
      <h2>Service Request Statuses</h2>
      <canvas id="barChart" style="width: 90%; height: 90%;"></canvas>
    </div>




    <!-- Total Services -->
    <div style="margin-top:50px">
      <h3>Total Services: {{ totalServices }}</h3>
    </div>

    <!-- Total Professionals and Customers -->
    <div>
      <h3>Total Professionals and Customers: {{ totalProfessionalsCustomers }}</h3>
    </div>
  </div>
`,
  data() {
    return {
      professionals: 0,
      customers: 0,
      services: 0,
      closedRequests: 0,
      acceptedRequests: 0,
      rejectedRequests: 0,
      requestedRequests: 0
    }
  },
  computed: {
    totalProfessionalsCustomers() {
      return this.professionals + this.customers;
    },
    totalServices() {
      return this.services;
    }
  },
  mounted() {
    fetch(`${location.origin}/api/adminsummary`)
      .then(response => response.json())
      .then(data => {
        this.professionals = data.professionals;
        this.customers = data.customers;
        this.services = data.services;
        this.closedRequests = data.closed_service_requests;
        this.acceptedRequests = data.accepted_service_requests;
        this.rejectedRequests = data.rejected_service_requests;
        this.requestedRequests = data.requested_service_requests;

        this.renderCharts();
      });

  },
  methods: {
    renderCharts() {
      // Pie Chart (Professionals vs Customers)
      new Chart(document.getElementById("pieChart"), {
        type: 'pie',
        data: {
          labels: ['Professionals', 'Customers'],
          datasets: [{
            data: [this.professionals, this.customers],
            backgroundColor: ['#FF5733', '#33FF57'],
            hoverBackgroundColor: ['#FF5733', '#33FF57']
          }]
        },
        options: {
          responsive: true,  // Make the chart responsive to container size
          maintainAspectRatio: false  // Allow resizing based on the container
        }
      });

      // Bar Chart (Service Request Statuses)
      new Chart(document.getElementById("barChart"), {
        type: 'bar',
        data: {
          labels: ['Closed', 'Accepted', 'Rejected', 'Requested'],
          datasets: [{
            label: 'Service Request Counts',
            data: [this.closedRequests, this.acceptedRequests, this.rejectedRequests, this.requestedRequests],
            backgroundColor: '#4e73df',
            borderColor: '#4e73df',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,  // Make the chart responsive
          maintainAspectRatio: false,  // Allow resizing based on container size
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

}