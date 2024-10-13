import puppeteer from 'puppeteer';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('searchTerm');

    if (!searchTerm) {
        return new Response(
            JSON.stringify({ error: 'Search term is required' }),
            { status: 400 }
        );
    }

    try {
        // Launch the browser in headless mode with additional arguments
        const browser = await puppeteer.launch({
            headless: 'new', // Use the latest headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Safe for server environments
        });
        const page = await browser.newPage();

        // Navigate to DuckDuckGo image search
        const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(
            searchTerm
        )}&iax=images&ia=images`; // Fixed backticks for string interpolation
        await page.goto(searchUrl);

        // Wait for the images to load
        await page.waitForSelector('img.tile--img__img', { timeout: 5000 });

        // Extract the first image URL
        const imageUrl = await page.evaluate(() => {
            const img = document.querySelector('img.tile--img__img');
            return img ? img.src : null;
        });

        // Close the browser
        await browser.close();

        // Send the image URL back as a response
        if (imageUrl) {
            return new Response(JSON.stringify({ imageUrl }), { status: 200 });
        } else {
            return new Response(
                JSON.stringify({
                    error: 'No images found for the search term.',
                }),
                { status: 404 }
            );
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching image' }), {
            status: 500,
        });
    }
}
