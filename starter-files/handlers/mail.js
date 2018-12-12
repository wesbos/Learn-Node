const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
const juice = require('juice');
const htmlToText = require('html-to-text');

var transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

function generateMailTemplate(mailTemplate, option) {
  const html = pug.renderFile(
    path.resolve(__dirname, `../views/email/${mailTemplate}.pug`),
    option
  );

  return juice(html);
}

/**
 * @function {sendMail}
 * @param  {String} mailTemplate {Mail template name in Views}
 * @param  {Object} option       {Is object containt User, and smt else render in template}
 * @return {Promise} {Promise}
 */
exports.sendMail = (mailTemplate, option) => {
  const html = generateMailTemplate(mailTemplate, option);

  return new Promise((resolve, reject) => {
    transport.sendMail(
      {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: option.user.mail, // list of receivers
        subject: option.user.subject, // Subject line
        text: htmlToText.fromString(html), // plain text body
        html // html body
      },
      (error, info) => {
        if(error) reject(error);
        else resolve(info);
      }
    );
  });

}
