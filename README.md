# 🌐 WorldItSocialNetwork – Back-End

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

This repository contains the server-side application for **WorldItSocialNetwork**, a social media platform designed for connectivity and interaction.  
It now uses **Bun** as a modern, ultra-fast runtime instead of Node.js.

---

## 🚀 Technologies Used

- **Core:** Bun, TypeScript, Express.js
- **Database:** SQLite (via Prisma ORM)
- **Authentication:** JWT, Bcrypt
- **File Handling:** Multer
- **Communication:** Nodemailer

---

## 📁 Project Structure

```text
WorldItSocialNetwork-Back-End/
├── prisma/
│   └── schema.prisma
├── public/
│   └── uploads/
├── src/
│   ├── index.ts
│   ├── socket.ts
│   ├── config/
│   ├── middlewares/
│   ├── types/
│   ├── utils/
│   ├── userApp/
│   ├── postApp/
│   ├── friendshipApp/
│   ├── chatsApp/
│   ├── messagesApp/
│   └── albumApp/
├── .env
├── package.json
└── tsconfig.json
```

---

# 🛠️ Getting Started

## 1️⃣ Install Dependencies

```bash
bun install
```

## 2️⃣ Environment Configuration

```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_super_secret_key"
```

## 3️⃣ Run Migrations

```bash
bun run prisma:migrate
```

## 4️⃣ Start the Server

```bash
bun run dev
```

---

# 📡 API Endpoints

## 👤 Users (/users)

| Method | Endpoint  | Description                           |
| ------ | --------- | ------------------------------------- |
| POST   | /reg      | Register a new user                   |
| POST   | /log      | Login user                            |
| POST   | /sendCode | Send code by email                    |
| GET    | /me       | Get information about user from token |
| PUT    | /:id      | Update user by id                     |
| GET    | /all      | Get all users                         |
| GET    | /:id      | Get user by id                        |

## 📝 Posts (/posts)

| Method | Endpoint | Description  |
| ------ | -------- | ------------ |
| GET    | /        | Get all post |
| POST   | /create  | Create post  |
| PUT    | /:id     | Update post  |
| DELETE | /:id     | Delete post  |

## 🖼️ Albums (/albums)

| Method | Endpoint | Description    |
| ------ | -------- | -------------- |
| GET    | /        | Get all albums |
| POST   | /create  | Create album   |
| PUT    | /:id     | Update album   |
| DELETE | /:id     | Delete album   |

## 👥 Friends (/friendship)

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | /all              | Get friends    |
| POST   | /create           | Send request   |
| POST   | /acceptFriendship | Accept request |
| DELETE | /deleteFriendship | Remove friend  |

## 💬 Chat (/chats)

| Method | Endpoint | Description       |
| ------ | -------- | ----------------- |
| GET    | /        | Get conversations |
| POST   | /create  | Start chat        |
| GET    | /:id     | Get messages      |

## 🗨️ Messages (/messages)

| Method | Endpoint | Description    |
| ------ | -------- | -------------- |
| DELETE | /:id     | Delete message |
| POST   | /create  | Send message   |
| GET    | /:id     | Get message    |

---

# 🖼️ File Uploads

Images stored in:

```
public/uploads/
```

---

# 📜 Bun Scripts

| Command                    | Description                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| **bun run start**          | Run compiled project from `dist/index.js`                             |
| **bun run dev**            | Run project in development mode using Bun (runs TypeScript directly)  |
| **bun run build**          | Build TypeScript → JavaScript (`tsc`)                                 |
| **bun run prisma:format**  | Format Prisma schema                                                  |
| **bun run prisma:migrate** | Apply Prisma migrations                                               |
| **bun run prisma:seed**    | Run Prisma seed                                                       |
| **bun run lint**           | Run ESLint                                                            |
| **bun run lint:fix**       | Fix ESLint issues automatically                                       |
| **bun run format**         | Format code with Prettier                                             |
| **bun run prettier:check** | Check formatting with Prettier                                        |
| **bun run copy:prisma**    | Copy generated Prisma client to `dist/generated` (Windows PowerShell) |
| **bun run release**        | Run semantic-release                                                  |
