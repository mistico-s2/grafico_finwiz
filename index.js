const express = require('express');
const bodyParser = require('body-parser');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ChartDataLabels = require('chartjs-plugin-datalabels');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Tamanho do gráfico
const width = 600;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: 'white', // fundo branco
  plugins: {
    modern: ['chartjs-plugin-datalabels']
  }
});

app.post('/grafico-png', async (req, res) => {
  const { labels, dados, total, periodo, info, hora } = req.body;

  if (!Array.isArray(labels) || !Array.isArray(dados)) {
    return res.status(400).json({ erro: 'Labels e dados devem ser arrays' });
  }

  const configuration = {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Gastos',
        data: dados,
        backgroundColor: 'rgba(70, 148, 125, 0.6)',
        borderRadius: 10,
        barPercentage: 1.0
      }]
    },
    options: {
      responsive: false,
      layout: {
        padding: {
          top: 60,
          bottom: 60,
          left: 20,
          right: 20
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => `R$ ${context.parsed.y},00`
          }
        },
        datalabels: {
          color: 'white',
          anchor: 'end',
          align: 'start',
          font: { weight: 'bold' },
          formatter: value => `${value}`
        },
        title: {
          display: true,
          text: `R$ ${total} - ${periodo}`,
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            bottom: 10
          },
          color: '#2d7858'
        },
        subtitle: {
          display: true,
          text: info,
          font: {
            size: 14
          },
          color: '#555',
          padding: {
            top: 10
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false
          },
          border: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  };

  try {
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration, 'image/png');
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao gerar o gráfico', mensagem: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
