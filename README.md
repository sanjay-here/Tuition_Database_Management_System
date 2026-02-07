[Live Demo](https://tuition-database-management-system.vercel.app/)


# 📘 VHP Tuition Management System

## 🏫 Vishva Hindu Parishad (VHP) – Tuition Management System

This is a modern web-based Tuition Management System developed for **Vishva Hindu Parishad (VHP)** tuition centers. It helps manage student records efficiently, with features for student tracking, admin access, and smooth transitions between active and passed-out students.

---

## 🚀 Features

- 🔐 Secure admin login with username and password
- ➕ Add new students with:
  - Name, Gender, Aadhar Number
  - Parent Details
  - Subjects Enrolled
  - School Name
  - Address
  - Date of Joining
- 🔁 Move students from "Currently Studying" to "Students Who Left"
- 📅 Track Date of Leaving and Remarks
- 🏫 Class entries from LKG to Grade 12
- 📂 Organized student record display by status
- 📱 Responsive UI with smooth animations
- 🧾 Minimal but informative footer with credits and contact info

---

## ⚙️ Technologies Used

- **Supabase** – Backend Database & Authentication
- **React.js** – Frontend Development
- **Tailwind CSS** – Styling
- **Vite** – Fast build & development server

---

## 💾 How to Run This Project

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/your-username/vhp-tuition-management.git
cd vhp-tuition-management
```

### 2. 📁 Install Dependencies

```bash
npm install
```

### 3. ⚙️ Configure Supabase

Create a new project on [Supabase](https://supabase.com) and set up these tables:

- `students`
- `classes`
- `admin_users`

Make sure relationships are configured properly.

### 4. 🔐 Add Environment Variables

Create a `.env` file in the root and add:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. ▶️ Start the Development Server

```bash
npm run dev
```

Visit the app at:  
🌐 `http://localhost:5173`

---

## ✅ Admin Credentials (for demo/testing)

```
Username: admin
Password: admin123
```

> You can update this via the `admin_users` table in Supabase dashboard.

---

## 📃 License

This project is maintained under the **Vishva Hindu Parishad (VHP)** educational initiative. Built as a community contribution.
