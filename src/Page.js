const puppeteer = require("puppeteer");

module.exports = async function (video_url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    //await page.setViewport({ width: 1000, height: 926 });
    await page.goto(video_url, { waitUntil: "networkidle2" });

    const comments = await page.evaluate(async () => {
        //await new Promise((res) => setTimeout(res, 10000));
        await new Promise((res, rej) => {
            let totalHeight = 0;
            let distance = 100;
            let timer = setInterval(() => {
                let scrollHeight = document.documentElement.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    res();
                }
            }, 100);
        });

        const commentArray = [];
        const comments = document.getElementsByTagName(
            "ytd-comment-thread-renderer"
        );

        for (let comment of comments) {
            commentArray.push({
                comment: comment.$.comment.innerText,
                author: comment.$.comment.$["author-thumbnail"].innerHTML,
            });
        }

        return JSON.stringify(commentArray);
    });

    return JSON.parse(comments);
};
