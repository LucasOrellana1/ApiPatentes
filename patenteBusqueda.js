const express = require('express');
const app = express();
const { chromium } = require('playwright');
const cheerio = require('cheerio');

async function buscarPatente(searchQuery) {
    // Iniciar una nueva instancia del navegador Chromium
    const browser = await chromium.launch({ headless: true }); // headless: false para ver la navegación

    try {
        // Crear una nueva página
        const page = await browser.newPage();

        // Ir a la página de Google
        await page.goto('https://www.patentechile.com');

        await page.waitForLoadState()

        // Esperar a que el campo de búsqueda esté disponible
        await page.waitForSelector('input[name="term"]');

        // Escribir la consulta de búsqueda
        await page.fill('input[name="term"]', searchQuery);

        // Presionar Enter para realizar la búsqueda
        await page.press('input[name="term"]', 'Enter');

        await page.waitForSelector('table#tblVehicl3-x');

        // Obtener todo el HTML de la página resultante de la búsqueda
        const html = await page.content();

        // Cargar el HTML en Cheerio y extraer los datos de la tabla
        const $ = cheerio.load(html);
        let patenteJson = {}

        $('table').each((index, tabla) => {
            // Buscar todas las filas en la tabla
            $(tabla).find('tr').each((i, fila) => {
                // Supongamos que queremos extraer el texto de todas las celdas en la fila
                const datos_fila = [];
                $(fila).find('td').each((j, celda) => {
                    datos_fila.push($(celda).text());
                })
                if (datos_fila.length == 2){
                    patenteJson[String(datos_fila[0].trim())] = datos_fila[1] 
                }
            });
        });
        return patenteJson

    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
    } 
}

// MODULOS A
exports.buscarPatente = buscarPatente;


