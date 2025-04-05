// TODO: Make better comments
// Add try catch blocks for 'risky operations'
// Make a .spec.ts file

// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
    // launch browser
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // go to Hacker News
    await page.goto("https://news.ycombinator.com/newest");

    // Select all spans with the class "age"
    const ageLocator = page.locator("span.age");

    // Extract the text content of each element
    const timestamps = [];
    const totalTimestamps = 100;
    while (timestamps.length < totalTimestamps) {
        let timestampsRemaining = totalTimestamps - timestamps.length; // Calculate remaining timestamps needed
        const iterations = timestampsRemaining > 30 ? 30 : timestampsRemaining; // Determine how many times to loop (30 or less)

        for (let i = 0; i < iterations; i++) {
            const title = await ageLocator.nth(i).getAttribute("title"); // Get the title attribute
            const unixTimestamp = title.split(" ")[1]; // Extract the Unix timestamp (number after the space)
            timestamps.push(Number(unixTimestamp)); // Convert to a number and push to the array
        }

        if (timestamps.length < totalTimestamps) { // Only click "More" if more articles are needed
            const moreButton = page.locator("a.morelink");
            await moreButton.click(); // Click the "More" button
            await page.waitForSelector("span.age", { state: "attached" });
        }
    }

    // Verify the articles are sorted from newest to oldest
    const isSorted = timestamps.every((timestamp, index) => {
        if (index === 0) return true; // Skip the first element
        return timestamp <= timestamps[index - 1]; // Compare with the previous element
    });
    console.log(isSorted);
    console.log(timestamps.length);

    await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
