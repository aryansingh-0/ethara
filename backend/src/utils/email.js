import nodemailer from 'nodemailer';
import { config } from '../config/envConfig.js';

const sendEmail = async (options) => {
  const isGmail = config.emailHost.includes('gmail');
  
  const transporter = nodemailer.createTransport(
    isGmail 
      ? {
          service: 'gmail',
          auth: {
            user: config.emailUser,
            pass: config.emailPass,
          },
        }
      : {
          host: config.emailHost,
          port: config.emailPort,
          auth: {
            user: config.emailUser,
            pass: config.emailPass,
          },
        }
  );

  // 2) Define the email options
  const mailOptions = {
    from: 'Ethara App <noreply@ethara.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
