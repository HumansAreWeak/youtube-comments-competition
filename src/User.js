module.exports = function (comments, parameters, callback) {
    const userArray = [];

    comments.forEach((element, i) => {
        const vals = element.comment.split("\n");

        const image_src = element.author.match(/(?<=\bsrc=")[^"]*/m);

        userArray.push({
            name: vals[0],
            image: image_src[0],
            comment: vals[2],
            when: vals[1],
        });
    });

    callback(userArray);
};
