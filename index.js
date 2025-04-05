// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
    let browser;
    try {
        // Launch browser
        browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();
        const page = await context.newPage();

        // Navigate to Hacker News
        try {
            url = "https://news.ycombinator.com/newest";
            await page.goto(url);
        } catch (error) {
            console.error(`Failed to navigate to ${url}:`, error);
            return;
        }

        // Create a locator for article timestamps
        const ageLocator = page.locator("span.age");

        // Add 100 timestamps to an array
        const timestamps = [];
        const totalTimestamps = 100;
        while (timestamps.length < totalTimestamps) {
            let timestampsRemaining = totalTimestamps - timestamps.length;
            const iterations = timestampsRemaining > 30 ? 30 : timestampsRemaining;

            // Add individual timestamps to the array
            for (let i = 0; i < iterations; i++) {
                try {
                    const title = await ageLocator.nth(i).getAttribute("title");
                    const unixTimestamp = title.split(" ")[1];
                    timestamps.push(Number(unixTimestamp));
                } catch (error) {
                    console.error(`Failed to extract timestamp for element ${i}:`, error);
                }
            }

            // Click the "More" button to load more articles
            if (timestamps.length < totalTimestamps) {
                try {
                    await page.locator("a.morelink").click();
                } catch (error) {
                    console.error("Failed to load more articles:", error);
                    break;
                }
            }
        }

        // Verify the articles are sorted from newest to oldest
        const isSorted = timestamps.every((timestamp, index) => {
            if (index === 0) return true;
            return timestamp <= timestamps[index - 1];
        });
        console.log("Are the first 100 articles sorted from newest to oldest?", isSorted);
        console.log("Total timestamps collected:", timestamps.length);
    } catch (error) {
        console.error("An unexpected error occurred:", error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

(async () => {
    await sortHackerNewsArticles();
})();
