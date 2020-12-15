const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
let sendMail;
try {
  console.log('Init mail transport');
  let options = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  };
  const transport = nodemailer.createTransport(options);
  sendMail = promisify(transport.sendMail, transport);
  console.log('Transport initialized with: ', options);

} catch (e) {
  console.log(e);
}
const generateHtml = (filename, options = {}) => {
  const html = pug.renderFile(`${ __dirname }/../views/email/${ filename }.pug`, options);
  return juice(html);
};
exports.send = async (options = {user: {}, subject: ''}) => {
  const html = generateHtml(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: `${ process.env.MAIL_FROM_NAME } <${ process.env.MAIL_FROM_EMAIL }>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };

  if (sendMail) {
    return sendMail(mailOptions);
  }
  console.error('Send mail not initialized');
};
