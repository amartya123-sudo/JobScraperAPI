# **Job Scraper & API Service**  

This project is a **web scraper and REST API** that collects job listings from career page of Google and stores them in a **MongoDB** database. The API allows users to retrieve job listings based on **filters** such as company name, job title, and location.  

---

## **📌 Features**  
✅ **Web Scraper:** Extracts job listings from company career pages.  
✅ **MongoDB Storage:** Stores job data in a structured format.  
✅ **REST API:** Provides job listings with filtering and pagination.  
✅ **Modular Code:** Uses separate `db.js` for database connection.  

---

## **🛠️ Tech Stack**  
- **Backend:** Node.js, Express.js  
- **Web Scraping:** Axios, Cheerio  
- **Database:** MongoDB (MongoDB Atlas)  
- **Environment Variables:** dotenv  

---

## **📂 Project Structure**  
```
📁 job-scraper-api
│── 📄 server.js        # Express.js API Server
│── 📄 scraper.js       # Web Scraper (Google, Microsoft, etc.)
│── 📄 db.js            # MongoDB Connection
│── 📄 .env             # Environment Variables (Not pushed here because of security reasons)
│── 📄 package.json     # Node.js Dependencies
│── 📄 README.md        # Project Documentation
```

---

## **🚀 Setup & Installation**  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/your-username/job-scraper-api.git
cd job-scraper-api
```

### **2️⃣ Install Dependencies**  
```sh
npm install
```

### **3️⃣ Configure Environment Variables**  
Create a `.env` file and add your **MongoDB URI** and **server port**.

### **4️⃣ Run the Scraper**  
To scrape job listings and store them in MongoDB:  
```sh
node scraper.js
```

### **5️⃣ Start the API Server**  
```sh
node server.js
```
Server runs at: **http://localhost:3000**  

---

## **📡 API Endpoints**  

### **🔍 Get All Jobs**  
```http
GET /api/jobs
```

### **🔍 Filter Jobs by Company**  
```http
GET /api/jobs?company=Google
```

### **🔍 Filter Jobs by Job Title**  
```http
GET /api/jobs?jobTitle=Engineer
```

### **🔍 Filter Jobs by Location**  
```http
GET /api/jobs?location=California
```

### **📑 Pagination Support**  
```http
GET /api/jobs?page=2&limit=5
```
