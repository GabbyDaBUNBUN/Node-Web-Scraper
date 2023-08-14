const cheerio = require('cheerio');
const axios = require('axios');
const j2cp = require('json2csv').Parser;
const fs = require('fs');

const url = 'https://books.toscrape.com/catalogue/category/books/mystery_3/index.html';
const baseUrl = 'https://books.toscrape.com/catalogue/category/books/mystery_3/'
const bookData = [];

async function getBooks(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const books = $('article');
        books.each(function () {
            title = $(this).find("h3 a").text();
            price = $(this).find(".price_color").text();
            stock = $(this).find(".availability").text();
            bookData.push({ title, price, stock });
            if ($(".next a").length > 0) {
                nextPage = baseUrl + $(".next a").attr("href");
                getBooks(nextPage)
            } else {
                const parser = new j2cp();
                const csv = parser.parse(bookData);
                fs.writeFileSync("./books.csv", csv);
            }
        });
        console.log(bookData);
    } catch (error) {
        console.error(error);
    }
}

getBooks(baseUrl);