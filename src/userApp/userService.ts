import { IError, IOkWithData } from "../types/types";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config/token";
import userRepository from "./userRepository";
import { CreateUser, User } from "./types";
import nodemailer from 'nodemailer';

const emailCodes = new Map<string, { code: string, expiresAt: number }>()

async function getUserById(id: number): Promise<IOkWithData<User> | IError> {
  try {
    const user = await userRepository.getUserById(id);

    if (!user) {
      return { status: "error", message: "User not found" };
    }

    return { status: "success", data: user };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    }
    return { status: "error", message: "Internal server error" };
  }
}

async function login(email: string, password: string): Promise<IOkWithData<string> | IError> {
  try {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      return { status: "error", message: "User not found" };
    }
    if (typeof user === "string") {
      return { status: "error", message: user };
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return { status: "error", message: "Passwords didn`t match" };
    }

    const token = sign({id: user.id}, SECRET_KEY, { expiresIn: "7d" });

    return { status: "success", data: token };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message};
    }
    return { status: "error", message: "Internal server error" };
  }
}
  
async function registration(userData: CreateUser): Promise<IOkWithData<string> | IError> {
  try {

    const user = await userRepository.findUserByEmail(userData.email);

    if (user) {
      return { status: "error", message: "User already exists" };
    }

    const hashedPassword = await hash(userData.password, 10);

    const hashedUserData = {
      ...userData,
      password: hashedPassword,
    };

    const newUser = await userRepository.createUser(hashedUserData);

    if (!newUser) {
      return { status: "error", message: "User is not created" };
    }

    const token = sign({id: newUser.id}, SECRET_KEY, { expiresIn: "1d" });

    return { status: "success", data: token };
    
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    }
    return { status: "error", message: "An unknown error occurred" };
  }
}



// async function sendEmail(email:string) {
  
//   const generateCode = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString(); // 6 цифр
//   }

//   const sendVerificationCode = (email: string) => {
//     const code = generateCode();
//     const expiresAt = Date.now() + 10 * 60 * 1000;

//     emailCodes.set(email, { code, expiresAt });

//   const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//           user: 'chitchatbyteam1@gmail.com', // Опять твоя почта, ну сколько можно?
//           pass: 'chitchatjsteam1' // Тот самый, который ты так и не нашел
//       }
//   });

//   try {
//       const info = await transporter.sendMail({ from: 'chitchatbyteam1@gmail.com', to: email, subject: 'check mail', text: code });
//       console.log('Письмо ушло, но ты всё равно дебил:', info.response);
//       return info;
//   } catch (err) {
//       console.error('Всё сломал, поздравляю, мудила:', err);
//       throw err; 
//   }
// }}

async function sendEmail(email: string) {

  const generateCode = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
  }

  const code = generateCode();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 5 минут


  emailCodes.set(email, { code, expiresAt });


  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'honcharovstallker@gmail.com',
          pass: 'qxja qfuk urdy qihr' 
      }
  });


  const mailOptions = {
      from: 'chitchatbyteam1@gmail.com',
      to: email,
      subject: 'Код подтверждения',
      text: code
  };

  try {

      const info = await transporter.sendMail(mailOptions);
      console.log('Письмо отправлено:', info.response);
      return { success: true, code };
  } catch (err) {
      console.error('Ошибка отправки:', err);
      throw new Error('Не удалось отправить письмо');
  }
}


function verifyCode(email: string, userInputCode: string) {
  const storedData = emailCodes.get(email);
  
  if (!storedData) {
      return { success: false, error: 'Код не найден или устарел' };
  }

  const { code, expiresAt } = storedData;

  if (Date.now() > expiresAt) {
      emailCodes.delete(email); 
      return { success: false, error: 'Код истёк' };
  }


  if (userInputCode !== code) {
      return { success: false, error: 'Неверный код' };
  }

  emailCodes.delete(email);
  return { success: true };
}
  
const userService = {
  login,
  registration,
  getUserById,
  sendEmail,
  verifyCode
};

export default userService;