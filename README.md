# 🎬 ระบบจัดการระเบียนหนัง (Movie Management System)

ระบบเว็บแอปพลิเคชันสำหรับจัดการข้อมูลภาพยนตร์แบบ Full-Stack พัฒนาด้วย React, TypeScript, Node.js, Express และ PostgreSQL

> พัฒนาเพื่อเป็น Technical Assignment สำหรับตำแหน่ง Full-Stack Developer

---

## 📋 ภาพรวมระบบ

ระบบนี้รองรับ **3 บทบาท (Role)**:

| บทบาท | คำอธิบาย |
|-------|----------|
| 👔 **Manager (ผู้จัดการ)** | มีสิทธิ์สูงสุด จัดการข้อมูลและผู้ใช้ได้ทั้งหมด |
| 👨‍💼 **Team Leader (หัวหน้าทีม)** | เพิ่ม แก้ไข และดูข้อมูลหนังได้ |
| 👷 **Floor Staff (พนักงานทั่วไป)** | ดูและค้นหาข้อมูลหนังได้เท่านั้น |

---

## ✨ ฟีเจอร์หลัก

### 🔐 ระบบการยืนยันตัวตน (Authentication)
- JWT Authentication พร้อม Refresh Token
- ระบบยืนยันตัวตน 2 ขั้นตอน ผ่านลิงก์ตั้งรหัสผ่านทางอีเมล
- Role-Based Access Control (RBAC) — แยกสิทธิ์ตามบทบาท
- ระบบ Logout และ Protected Routes

> **หมายเหตุ:** ผู้จัดการเป็นผู้สร้างบัญชีให้พนักงาน และกำหนด Role ด้วยตนเอง พนักงานจะได้รับอีเมลเพื่อตั้งรหัสผ่านครั้งแรก

---

### 🎥 ระบบจัดการข้อมูลหนัง (Movie Management)

| ฟีเจอร์ | Manager | Team Leader | Floor Staff |
|--------|:-------:|:-----------:|:-----------:|
| ดูรายการหนัง | ✅ | ✅ | ✅ |
| ดูรายละเอียดหนัง | ✅ | ✅ | ✅ |
| ค้นหาหนัง | ✅ | ✅ | ✅ |
| เพิ่มหนัง | ✅ | ✅ | ❌ |
| แก้ไขหนัง | ✅ | ✅ | ❌ |
| ลบหนัง | ✅ | ❌ | ❌ |


---

### 👥 ระบบจัดการผู้ใช้ (User Management)

| ฟีเจอร์ | Manager | Team Leader | Floor Staff |
|--------|:-------:|:-----------:|:-----------:|
| สร้างบัญชีพนักงาน | ✅ | ❌ | ❌ |
| กำหนด Role พนักงาน | ✅ | ❌ | ❌ |
| ดูรายชื่อและตำแหน่งพนักงาน | ✅ | ❌ | ❌ |


---

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **React** + **TypeScript**
- **MobX** + **MobX-State-Tree (MST)** — State Management

### Backend
- **Node.js** + **Express.js** + **TypeScript**

### Database
- **PostgreSQL** (รันผ่าน **Docker**)

### อื่นๆ
- **JWT** — Authentication
- **Multer** — อัปโหลดไฟล์รูปภาพ
- **Swagger** — API Documentation

---

## 🏗️ สถาปัตยกรรมระบบ Backend

ใช้แนวคิด **Layered Architecture**:

```
Controller  →  รับ HTTP Request / ส่ง Response
    ↓
Service     →  Business Logic
    ↓
Repository  →  Query ข้อมูลกับฐานข้อมูล
    ↓
PostgreSQL  →  ฐานข้อมูล
```

---

## 🚀 วิธีการรันโปรเจกต์

### ขั้นตอนที่ 1 — รัน Database ด้วย Docker Compose (Backend)

> ⚠️ **ต้องรันขั้นตอนนี้ก่อนเสมอ** เพื่อเปิดใช้งาน PostgreSQL

```bash
# เข้าไปที่โฟลเดอร์ backend
cd backend

# รัน Docker Compose เพื่อเริ่ม PostgreSQL
docker compose up -d
```

ตรวจสอบว่า container รันอยู่:

```bash
docker compose ps
```

---

### ขั้นตอนที่ 2 — รัน Backend

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev
```

Backend จะรันที่ `http://localhost:3000`

---

### ขั้นตอนที่ 3 — รัน Frontend

```bash
# เข้าไปที่โฟลเดอร์ frontend
cd ../frontend

# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev
```

Frontend จะรันที่ `http://localhost:5173`

---

### หยุดการทำงาน

```bash
# หยุด PostgreSQL container
cd backend
docker compose down
```

---

## 🔑 รหัสสำหรับทดสอบ

บัญชีผู้จัดการ (Manager):

```
Email:    manager@test.com
Password: 123456
```

---

## 📖 API Documentation

เปิด Swagger UI ได้ที่:

```
http://localhost:3000/api-docs
```

---
---

# 🎬 Movie Management System

A full-stack web application for managing movie records, built with React, TypeScript, Node.js, Express, and PostgreSQL.

> Developed as a Technical Assignment for a Full-Stack Developer position.

---

## 📋 System Overview

The system supports **3 Roles**:

| Role | Description |
|------|-------------|
| 👔 **Manager** | Highest privilege — full control over movies and users |
| 👨‍💼 **Team Leader** | Can add, edit, and view movie records |
| 👷 **Floor Staff** | Can only view and search movie records |

---

## ✨ Features

### 🔐 Authentication
- JWT Authentication with Refresh Token
- Two-step identity verification via email password setup link
- Role-Based Access Control (RBAC)
- Logout System and Protected Routes

> **Note:** Only the Manager can create employee accounts and assign roles. New employees receive an email link to set their password.

---

### 🎥 Movie Management

| Feature | Manager | Team Leader | Floor Staff |
|---------|:-------:|:-----------:|:-----------:|
| View Movie List | ✅ | ✅ | ✅ |
| View Movie Detail | ✅ | ✅ | ✅ |
| Search Movies | ✅ | ✅ | ✅ |
| Add Movie | ✅ | ✅ | ❌ |
| Edit Movie | ✅ | ✅ | ❌ |
| Delete Movie | ✅ | ❌ | ❌ |
| Upload Poster | ✅ | ✅ | ❌ |

---

### 👥 User Management

| Feature | Manager | Team Leader | Floor Staff |
|---------|:-------:|:-----------:|:-----------:|
| Create Employee Account | ✅ | ❌ | ❌ |
| Assign Employee Role | ✅ | ❌ | ❌ |
| View Employee List & Positions | ✅ | ❌ | ❌ |

---

## 🛠️ Tech Stack

### Frontend
- **React** + **TypeScript**
- **MobX** + **MobX-State-Tree (MST)** — State Management

### Backend
- **Node.js** + **Express.js** + **TypeScript**

### Database
- **PostgreSQL** (via **Docker**)

### Other
- **JWT** — Authentication
- **Multer** — File/image upload
- **Swagger** — API Documentation

---

## 🏗️ Backend Architecture

Uses **Layered Architecture**:

```
Controller  →  Handle HTTP Request / Response
    ↓
Service     →  Business Logic
    ↓
Repository  →  Database Queries
    ↓
PostgreSQL  →  Database
```

---

## 🚀 Getting Started

### Step 1 — Start the Database with Docker Compose (Backend)

> ⚠️ **Always run this first** to start PostgreSQL before anything else.

```bash
# Navigate to the backend folder
cd backend

# Start PostgreSQL via Docker Compose
docker compose up -d
```

Verify the container is running:

```bash
docker compose ps
```

---

### Step 2 — Run the Backend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Backend runs at `http://localhost:3000`

---

### Step 3 — Run the Frontend

```bash
# Navigate to the frontend folder
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173`

---

### Stopping the Services

```bash
# Stop the PostgreSQL container
cd backend
docker compose down
```

---

## 🔑 Test Credentials

Manager account:

```
Email:    manager@test.com
Password: 123456
```

---

## 📖 API Documentation

Access Swagger UI at:

```
http://localhost:3000/api-docs
```# movie_front-end
