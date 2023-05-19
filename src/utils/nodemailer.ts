import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import dotenv from 'dotenv';

const { readFile } = fs;
dotenv.config();

const sendMail = async (mailType: string, email: string) => {
  try {
    let html: string | Buffer;
    if (mailType === 'welcome') {
      html = await readFile('./src/utils/mailHtml/welcome-mail.html', 'utf8');
    } else if ('appointment') {
      html = await readFile('./src/utils/mailHtml/appointment-mail.html', 'utf8');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.email',
      port: 465,
      auth: {
        type: 'login',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER, // sender address
      to: email, // list of receivers
      subject: 'Welcome To Halo-Doc', // Subject line
      html,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default sendMail;
