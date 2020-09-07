const router = require("./index").router;
const page = require("./src/Page");
const user = require("./src/User");

router.get("/", (req, res) => {
    res.send("index");
});

router.post("/", async (req, res) => {
    const { body } = req;

    console.log(body);

    page(body["video-url"]).then((comments) => {
        user(comments, {}, (users) => {
            res.send(JSON.stringify(users));
        });
    });

    //res.send("Jaaa");
});
