const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { DateTime } = require('luxon');

const url = "https://www.amazon.com/2021-Modern-Reloading-Manual-2nd/dp/B094ZKD1WN/";

const targetClass = "tabular-buybox-container";

async function hasAtreoStore() {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const buyboxContainer = $(`.${targetClass}`);
    if (buyboxContainer.length) {
      const seller = buyboxContainer.find("#sellerProfileTriggerId");
      if (seller.length && seller.text().includes("Atreo Store")) {
        console.log("Atreo Store found!");
        return true;
      }
    }
    console.log("Class not found");
    return false;
  } catch (error) {
    if (error.response && error.response.status === 503) {
      console.log("Server returned status 503, trying again in 1 minute");
      await new Promise(resolve => setTimeout(resolve, 60000)); // wait 1 minute before retrying
      return hasAtreoStore();
    } else {
      console.error("Error while getting HTML", error);
      return false;
    }
  }
}

function createCsvReport(hasBuybox) {
  const currentDate = DateTime.now().setZone('America/Sao_Paulo').toFormat('dd/MM/yyyy - HH:mm');
  const row = hasBuybox ? ["[ TEMOS BUYBOX ]", `[ ${currentDate} ]`] : ["[ NAO ESTAMOS COM BUYBOX ]", `[ ${currentDate} ]`];
  const csvHeader = ["[ RELATORIO DE BUYBOX ]"];
  const csvFile = 'relatorio_buybox.csv';
  fs.stat(csvFile, (err, stat) => {
    const exists = !!stat;
    const csv = exists ? `${row.join(",")}\n` : `${csvHeader.join(",")}\n${row.join(",")}\n`;
    fs.appendFile(csvFile, csv, (error) => {
      if (error) {
        console.error("Error while appending to CSV file", error);
      } else {
        console.log(`CSV report successfully created at ${DateTime.now().toISO()}`);
      }
    });
  });
}

async function analyzeBuybox() {
  try {
    const hasBuybox = await hasAtreoStore();
    createCsvReport(hasBuybox);
  } catch (error) {
    console.error("Error while analyzing buybox", error);
  }
}

analyzeBuybox(); // Execute only once at start
