const { test, expect } = require('@playwright/test');

test('Check if exactly 100 articles are displayed and sorted', async ({ page }) => {
  
    await page.goto('https://news.ycombinator.com/newest', { waitUntil: 'networkidle', timeout: 60000 });

    await page.waitForSelector('#hnmain', { timeout: 60000 });
    console.log('Page loaded successfully');

    const articles = await page.$$eval('.titleline', links => links.map(link => link.textContent));
    console.log(`Number of articles found: ${articles.length}`);

    if (articles.length !== 100) {
        throw new Error(`There are not exactly 100 articles, found: ${articles.length}`);
    }

    const articleTimes = await page.$$eval('.age', times => 
        times.map(time => ({
            title: time.closest('.titleline').querySelector('#hnmain').textContent,
            time: new Date(time.getAttribute('title')).getTime()
        }))
    );
    console.log('Article times extracted');

    for (let i = 1; i < articleTimes.length; i++) {
        if (articleTimes[i].time > articleTimes[i - 1].time) {
            throw new Error('Articles are not sorted correctly');
        }
    }

    articleTimes.forEach(article => {
        console.log(`Title: ${article.title}, Time: ${new Date(article.time).toLocaleString()}`);
    });

    console.log('Articles are sorted correctly');
});










