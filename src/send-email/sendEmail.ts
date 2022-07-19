import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';

dotenv.config();

export const sendEmail = async (email: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });
  const info = await transporter.sendMail({
    from: '"verify password 👻" <gor95hov10@mail.ru>', // sender address
    to: email,
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: `<b>Hello world?</b> <a href="">confirm password</a>`, // html body
  });

  console.log('Message sent: %s', info.messageId);
};
