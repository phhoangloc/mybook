import { createTransport } from "nodemailer";

export const transporter = createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: "ph.hoangloc@gmail.com", // Email của bạn
        pass: "zvwk uxqg hrzi mrwu", // Mật khẩu hoặc mật khẩu ứng dụng
    },
});