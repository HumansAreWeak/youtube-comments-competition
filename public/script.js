class Script {
    video_url;
    parameters;

    /**
     * Makes everything to an readable ID for JavaScript (Removes Blank Spaces)
     * @param {string} text
     * @returns {string}
     */
    static toId(text) {
        const better = text.replaceAll(" ", "_");
        return better;
    }

    /**
     * Get the value of an element with the specific name => Element Name Attribute works like an ID
     * @param {string} element_name
     */
    static getValue(element_name) {
        const element = document.getElementsByName(element_name)[0];
        return element ? element.value ?? element.innerHTML : "";
    }

    /**
     * Get the value of an element with the specific tag => Element Tag works like an ID
     * @param {string} tag_name
     */
    static getTag(tag_name) {
        return document.getElementsByTagName(tag_name)[0];
    }

    /**
     * Construct and save all the data
     * @param {string} video_url
     * @param {object} parameters
     */
    constructor(video_url, parameters) {
        this.video_url = video_url;
        this.parameters = parameters;
        this.init();
    }

    /**
     * Initialize the program
     * @returns {void}
     */
    init() {
        const body = Script.getTag("body");
        body.innerHTML = this.getLoadingPage();
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ["video-url"]: this.video_url }),
        })
            .then((res) => res.json())
            .then((res) => {
                complete_users = res;
                startRandomness();
            });
    }

    getWinnerPage() {
        const users = complete_users;
        return `
        <div id="winner">
            <div id="emitter"></div>
            <fieldset class="box">
                <legend>And the winner is ... ?</legend>
                <p id="name">And the winner is...?</p>
            </fieldset>
            <div class="users">${users
                .map(
                    (element) =>
                        `<div class="user" id="${Script.toId(
                            element.name
                        )}"><img src="${element.image}" alt="${
                            element.name
                        }" /></div>`
                )
                .join("")}</div>
                <div class="comments">
                        ${users
                            .map(
                                (element) =>
                                    `<div class="comment" id="${Script.toId(
                                        element.name
                                    )}-comment">
                                    <div class="comment-head">
                                        <img src="${element.image}" alt="${
                                        element.name
                                    }" />
                                    <div>
                                        <p>${element.name}</p>
                                        <span>${element.when}</span>
                                    </div>
                                    </div>
                                    <div class="comment-body"><pre>${
                                        element.comment
                                    }</pre></div>
                                </div>`
                            )
                            .join("")}
                </div>
                <button onclick="startRandomness()" id="lone_button">Shuffle again!</button>
                <div class="information">
                    <a><img title="Information" src="question-mark.svg" /></a>
                    <a
                        href="https://github.com/HumansAreWeak/youtube-comments-competition"
                        ><img title="GitHub Repo" src="github.svg"
                    /></a>
                </div>
        </div>
        `;
    }

    /**
     * Returns the loading page as HTML
     * @returns {string}
     */
    getLoadingPage() {
        return `
    <h1 class="title">YouTube Comments Competition</h1>
    <div class="loader-wrapper">
        <div class="loading">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <div class="center">
        <p><a href="${this.video_url}" target="_blank">[${this.video_url}]</a></p>
        <p></p>
        <p>We are currently gathering all the viewer informations...</p>
        <p>This might take a while (a long time if 1000+ comments!).</p>
    </div>
    <div class="information">
        <a><img title="Information" src="question-mark.svg" /></a>
        <a
            href="https://github.com/HumansAreWeak/youtube-comments-competition"
            ><img title="GitHub Repo" src="github.svg"
        /></a>
    </div>
    `;
    }
}

let complete_users = [];
/**
 * @type {Script}
 */
let script;

function loadVideo() {
    script = new Script(Script.getValue("video-url"), {});
}

function startRandomness() {
    const body = Script.getTag("body");
    body.innerHTML = script.getWinnerPage();
    const users = complete_users;

    let nameBox = document.getElementById("name");

    let start;
    let elapsed;
    let fCounter = 0;
    let fSkip = 1;

    function update(timestamp) {
        if (start === undefined) start = timestamp;
        elapsed = timestamp - start;

        if (fCounter > fSkip) {
            let rId = Math.floor(Math.random() * users.length);
            let winner = users[rId].name;
            nameBox.innerHTML = winner;
            fSkip *= 1.1;
        }

        fCounter++;
        if (elapsed < 5000) window.requestAnimationFrame(update);
        else {
            const name = Script.toId(nameBox.innerHTML);
            userWon(name);
        }
    }

    window.requestAnimationFrame(update);
}

function userWon(user_id) {
    const element = document.getElementById(user_id);
    element.classList.add("user-winner");

    const comment = document.getElementById(user_id + "-comment");
    comment.classList.add("user-winner-comment");

    const winner = document.getElementById("winner");
    winner.innerHTML =
        `<h1 class="title">We have a Winner!!</h1>` + winner.innerHTML;

    const loneButton = document.getElementById("lone_button");
    loneButton.classList.add("show");
}
