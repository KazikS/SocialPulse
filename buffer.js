const axios = require("axios");
const cheerio = require("cheerio");

function formatDate(dateStr) {
    const months = {
        'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3,
        'мая': 4, 'июня': 5, 'июля': 6, 'августа': 7,
        'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
    };

    // Удаляем мешающие части строки и лишние пробелы
    const cleanStr = dateStr.replace(/года,?\s*/i, '').trim();
    const match = cleanStr.match(/(\d{1,2})\s+([а-я]+)\s+(\d{4})/i);
    if (!match) return null;

    const [, day, monthName, year] = match;
    const month = months[monthName.toLowerCase()];
    if (typeof month === 'undefined') return null;

    return Math.floor(Date.UTC(year, month, day) / 1000);
}

async function scrape(baseUrl, dateFrom, dateTo) {
    const startTimestamp = Math.floor(new Date(dateFrom).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(dateTo).getTime() / 1000);
    const result = [];
    let hasMorePost = true;
    let page = 0;
    try {
        while (hasMorePost) {
            let url = `${baseUrl}/news/?page=${page}`
            const response = await axios.get(url, {timeout: 10000});
            const $ = cheerio.load(response.data);

            const posts = $('.content div.post');
            if (posts.length === 0) break;
            for (const post of posts) {
                const $post = $(post);
                const dateText = $post.find('.post__time').text();
                const postTimestamp = formatDate(dateText);
                if (!postTimestamp) continue;
                if (postTimestamp > endTimestamp) continue;

                if (postTimestamp < startTimestamp) {
                    hasMorePost = false;
                    break;
                }

                if (postTimestamp >= startTimestamp && postTimestamp <= endTimestamp) {
                    result.push({
                        title: $post.find(".post__name").text().trim(),
                        link: new URL($post.find(".post__name").attr("href"), baseUrl).href,
                        image: new URL($post.find(".post__image img").attr("src"), baseUrl).href,
                        date: postTimestamp,
                    });
                }

            }
            page++;
        }
    } catch (error) {
        console.error('Error during scraping:', error.message);
    }
    console.log("Длина массива постов " + result.length);
    return result;
}

// Пример использования
scrape('https://archive.alania.gov.ru/', '2025-01-01', '2025-01-31')
    .then(data => console.log(''));