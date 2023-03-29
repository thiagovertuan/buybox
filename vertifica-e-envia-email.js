const fetch = require('node-fetch');
const DOMParser = require('dom-parser');
const sendinblue = require('sendinblue-api');

const url = 'https://www.amazon.com/2021-Modern-Reloading-Manual-2nd/dp/B094ZKD1WN/';
const sendinblueApiKey = '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';
const fromEmail = 'thiagovertuan@hotmail.com';
const fromEmailPassword = '123456';
const toEmail = 'demoniakow@hotmail.com';

// Configurar o cliente do Sendinblue
const sendinblueClient = new sendinblue({apiKey: sendinblueApiKey, timeout: 5000});

// Definir função que envia email
function sendEmail(subject, text) {
  const sendSmtpEmail = {
    to: [{email: toEmail}],
    sender: {email: fromEmail},
    subject: subject,
    textContent: text,
    replyTo: {email: fromEmail}
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
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
    const horaFormatada = dataAtual.toLocaleTimeString('pt-BR');
    const dataHoraFormatada = `${dataFormatada} - ${horaFormatada}`;

    let message = [];

    if (buyboxContainer && buyboxContainer.textContent.indexOf("Atreo") === -1) {
      message.push("[ NÃO TEMOS BUYBOX ] - [ "+dataHoraFormatada+" ]");
    }
    else {
       message.push("[ TEMOS BUYBOX ] - [ "+dataHoraFormatada+" ]");
    }

    // Enviar email diário com o conteúdo da variável `message`
    const subject = 'Relatório diário do Buybox';
    const text = `Data: ${new Date().toISOString()}\n\n${message.join('\n')}`;
    
    // Enviar e-mail autenticado
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: fromEmail,
            pass: fromEmailPassword
        }
    });

    const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
  })
  .catch(error => {
    console.log(error);
  });
