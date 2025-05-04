const url = new URL('https://archive.alania.gov.ru/news/2187');
console.log(`${url.hostname}\n${url.pathname.split('/').pop()}`);
console.log(new Date(1738281600 * 1000))