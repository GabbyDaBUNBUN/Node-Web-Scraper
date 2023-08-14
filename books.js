const cheerio = require('cheerio');
const axios = require('axios');

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
            }
        });
        console.log(bookData);
    } catch (error) {
        console.error(error);
    }
}

getBooks(baseUrl);