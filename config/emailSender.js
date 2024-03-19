const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'sajli72002@gmail.com', 
    pass: 'txwd ictt wknc mecg'
  }
});
module.exports = transporter;
