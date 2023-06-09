const url = 'https://www.amazon.com/2021-Modern-Reloading-Manual-2nd/dp/B094ZKD1WN/';

fetch(url)
  .then(response => response.text())
  .then(data => {
    // Analisar a resposta do site da AMAZON e extrair informações de conteudo se temos buybox
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    const buyboxContainer = doc.querySelector('.tabular-buybox-container');

    if (buyboxContainer && buyboxContainer.textContent.indexOf("Atreo") === -1) {
      console.log("NÃO TEMOS BUYBOX");
    }
    else
    {
      console.log("TEMOS BUYBOX");
    }
  })
  .catch(error => {
    console.log(error);
  });

