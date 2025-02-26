// charts.js
const ctx = document.getElementById('incomeChart').getContext('2d');

const incomeChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [
            {
                label: 'מספר שיעורים',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'סכום כולל',
                data: [],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'התפלגות השיעורים לפי תלמיד'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateChart(data) {
    incomeChart.data.labels = data.labels;
    incomeChart.data.datasets[0].data = data.lessonCounts;
    incomeChart.data.datasets[1].data = data.totalAmounts;
    incomeChart.update();
}