const express = require('express'),
      app = express(),
      puppeteer = require('puppeteer');

const PORT = process.env.PORT || 3000;

app.get("/", async (request, response) => {
    let url = (request.query.url)? request.query.url : "http://clocks.elalemanyo.de",
        fullPage = (request.query.fullpage)? (request.query.fullpage == 'true') : false;

    let viewPort = {
        width: (request.query.width)? parseInt(request.query.width) : undefined,
        height: (request.query.height)? parseInt(request.query.height) : undefined
    };

    if (request.query.template) {
        switch(request.query.template) {
            case 'fb':
                viewPort = {
                    width: 1200,
                    height: 628
                };
            break;
            case 'twitter':
                viewPort = {
                    width: 1200,
                    height: 675
                };
            break;
        }
    }

    Object.keys(viewPort).forEach(key => viewPort[key] === undefined && delete viewPort[key]);

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
            headless: true
        });

        const page = await browser.newPage();
        await page.goto(url);

        if (Object.keys(viewPort).length !== 0) await page.setViewport(viewPort);

        const image = await page.screenshot({
            fullPage: fullPage
        });
        await browser.close();
        response.set('Content-Type', 'image/png');
        response.send(image);
    } catch (error) {
        console.log(error);
    }
});

var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
