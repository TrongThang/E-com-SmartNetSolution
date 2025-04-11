const nodemailer = require('nodemailer');
// const hbs = require('nodemailer-express-handlebars');
const path = require("path");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Error:", error);
    } else {
        console.log("SMTP Ready:", success);
    }
});

(async () => {
    const hbs = (await import("nodemailer-express-handlebars")).default;

    transporter.use(
        "compile",
        hbs({
            viewEngine: {
                extname: ".handlebars",
                layoutsDir: path.join(__dirname, "../templates/emails"),
                defaultLayout: false,
            },
            viewPath: path.join(__dirname, "../templates/emails"),
            extName: ".handlebars",
        })
    );
})();

module.exports = transporter;
