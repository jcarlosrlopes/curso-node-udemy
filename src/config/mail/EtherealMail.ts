import nodemailer from 'nodemailer';

interface SendMailDTO {
  to: string;
  body: string;
}

export default class EtherealMail {
  static async sendMail({ to, body }: SendMailDTO): Promise<void> {
    const account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    const message = await transporter.sendMail({
      from: 'equipe@apivendas.com.br',
      to,
      subject: 'Recuperação de senha',
      text: body,
    });

    //   if (err) {
    //     console.log('Erro no envio de email: ', err.message);
    //   }

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
