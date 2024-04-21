const ctx = document.getElementById('grafico').getContext('2d');

fetch('/chart-data')
  .then(response => response.json())
  .then(({labels, dataBitcoin, dataEthereum}) => {
    const originalTimestamps = labels;
    labels = labels.map(timestamp => {
      const date = new Date(timestamp * 1000);
      const day = date.getUTCDate();
      let month = date.toLocaleString('es-ES', { month: 'long', timeZone: 'UTC' });
      month = month.charAt(0).toUpperCase() + month.slice(1);
      return `${day} ${month}`;
    });

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Bitcoin',
          data: dataBitcoin,
          borderColor: 'rgb(77, 238, 234)',
          backgroundColor: 'rgba(77, 238, 234, 0.2)',
          yAxisID: 'y',
        }, 
        {
          label: 'Ethereum',
          data: dataEthereum,
          borderColor: '#FF69B4',
          backgroundColor: 'rgba(255, 105, 180, 0.2)',
          yAxisID: 'y1',
        }
      ]
    };

    const myChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              title: function(tooltipItem) {
                const originalTimestamp = originalTimestamps[tooltipItem[0].dataIndex];
                const date = new Date(originalTimestamp * 1000);
                const day = date.getUTCDate().toString().padStart(2, '0');
                const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript empiezan en 0
                const year = date.getUTCFullYear();
                const hours = date.getUTCHours().toString().padStart(2, '0');
                const minutes = date.getUTCMinutes().toString().padStart(2, '0');
                return `${month}/${day}/${year} - ${hours}:${minutes}`;
              },
              label: function({parsed: {y}}) {
                return y !== null ? `  $${y.toFixed(2)}  USD` : '';
              }
            }
          },
          titleFont: {
            color: '#77c0d0', // El color que deseas para el título
          },
          bodyFont: {
            color: '#77c0d0', // El color que deseas para el cuerpo
          },
          legend: {
            labels: {
              color: 'white',
              font: {
                size: 15,
              }
            }
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'x',
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'white',
            },
            max:20
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgb(77, 238, 234)',
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            ticks:{
              color: '#FF69B4'
            }
          },
        },
        layout: {
          padding: 20
        },
        backgroundColor: 'black'
      }
    });

    document.getElementById('resetZoom').addEventListener('click', () => myChart.resetZoom());
  })
  .catch(err => console.error('Error:', err));