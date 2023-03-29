const fetch = require('node-fetch');
const DOMParser = require('dom-parser');
const sendinblue = require('sendinblue-api');

const url = 'https://www.amazon.com/2021-Modern-Reloading-Manual-2nd/dp/B094ZKD1WN/';
const sendinblueApiKey = 'SENDINBLUE_API_KEY';
const fromEmail = 'FROM_EMAIL';
const toEmail = 'TO_EMAIL';

// Configurar o cliente do Sendinblue
const sendinblueClient = new sendinblue({apiKey: sendinblueApiKey, timeout: 5000});

// Definir função que envia email
function sendEmail(subject, text) {
  const sendSmtpEmail = {
    to: [{email: toEmail}],
    sender: {email: fromEmail},
    subject: subject,
    textContent: text,
  };

  sendinblueClient.sendTransacEmail(sendSmtpEmail)
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

// Buscar dados da página da Amazon
fetch(url)
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    const buyboxContainer = doc.querySelector('.tabular-buybox-container');
    let message = '';

    if (buyboxContainer && buyboxContainer.textContent.indexOf("Atreo") === -1) {
      message = "NÃO TEMOS BUYBOX";
    }
    else {
       message = "TEMOS BUYBOX";
    }

    // Enviar email diário com o conteúdo da variável `message`
    const subject = 'Relatório diário do Buybox';
    const text = `Data: ${new Date().toISOString()}\n\n${message}`;
    sendEmail(subject, text);
  })
  .catch(error => {
    console.log(error);
  });
