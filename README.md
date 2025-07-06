# MEX-Shortner

A simple, high-performance URL shortening service built with **Express**, **MongoDB**, and **Redis**.  
I built this project to give developers a fast, reliable API for turning long URLs into compact links, with optional expiration, password protection, and analytics.

🔗 **Live Demo:** https://mexo.onrender.com

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Authentication Flow](#authentication-flow)  
- [API Reference](#api-reference)  
  - [Public Routes](#public-routes)  
  - [Protected Routes](#protected-routes)  
- [Examples](#examples) 

---

## Features

- **User Management**: Register, login, change password  
- **Keyed Access**: JWT auth + per-user API key  
- **Short URLs**: Create links with optional password, expiry, click limits  
- **Analytics**: Track total clicks, per-day breakdown, top IPs  
- **Performance**: Redis caching for hot lookups + MongoDB storage  
- **Responsive UI**: Tailwind + EJS templates, customizable front-end  

---

## Tech Stack

- **Backend**: Node.js + Express  
- **Database**: MongoDB (user & URL storage)  
- **Cache**: Redis (speed up redirect & analytics)  
- **Auth**: JSON Web Tokens (JWT) + API Keys  
- **Frontend**: EJS templates + Tailwind CSS  

---

## Getting Started

1. **Clone** the repo  
   ```bash
   git clone https://github.com/your-username/mex-shortner.git
   cd mex-shortnerInstall dependencies
   ```
2. **Install** dependencies
  ```bash
  npm install
```
3. **Configure** env variables in .env
   ```ini
     JWT_SECRET = 
    MONGO_URI = 
    REDIS_USERNAME = 
    REDIS_PASSWORD = 
    REDIS_HOST = 
    REDIS_PORT =
   ```
4. **Run** the server and **Browse** at http://localhost:3000 or use the **live** demo at https://mexo.onrender.com

##Authentication Flow
  ### Register ➔ receive token (JWT) & apikey

  ### Login ➔ receive token & apikey

  ## Client stores:
    token in an HttpOnly cookie

    apikey in localStorage

  ## Use either:

    Authorization: Bearer <token> header

    Cookie: token=<token>

## API Reference

**Base URL:** `https://mexo.onrender.com`

### Authentication
Protected routes require either:
- `Authorization: Bearer <token>` header **OR**
- `Cookie: token=<token>`

### Public Routes
| Method | Endpoint          | Description               | Request Body                     |
|--------|-------------------|---------------------------|----------------------------------|
| `GET`  | `/`               | Home page                 | -                                |
| `POST` | `/api/register`   | Register new user         | `{ name, email, password }`      |
| `POST` | `/api/login`      | Login existing user       | `{ email, password }`            |

### Protected Routes
| Method   | Endpoint                        | Description                     | Parameters/Body                                                                 |
|----------|---------------------------------|---------------------------------|---------------------------------------------------------------------------------|
| `GET`    | `/api/resetAPI`                 | Reset API key                   | -                                                                               |
| `POST`   | `/api/change-password`          | Change password                 | `{ currentPassword, newPassword }`                                              |
| `GET`    | `/api/profile`                  | Get user profile                | -                                                                               |
| `GET`    | `/api/allURL`                   | List all short URLs             | -                                                                               |
| `POST`   | `/api/create`                   | Create short URL                | `{ originalUrl, password? (string), expiresAt? (ISO date), clickLimit? (number) }` |
| `POST`   | `/api/create/token`             | Create URL with API key         | Query: `?apikey=<your-key>`<br>Body: Same as `/api/create`                      |
| `GET`    | `/api/analytics/:slug`          | Get URL analytics               | URL Param: `:slug`                                                              |
| `DELETE` | `/api/:slug`                    | Delete short URL                | URL Param: `:slug`                                                              |
| `GET`    | `/:slug`                        | Redirect to original URL        | URL Param: `:slug`                                                              |

### Optional Parameters
Parameters marked with `?` are optional:
- `password`: Password-protect the short URL
- `expiresAt`: Set expiration date (ISO format)
- `clickLimit`: Set maximum allowed clicks

## API Examples

### 1. User Registration

**Request:**
```bash
curl -X POST https://mexo.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "secret123"
  }'
```
**Response**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "<your-jwt-token>",
  "user": {
    "id": "abcdef12345",
    "name": "Alice",
    "email": "alice@example.com",
    "apikey": "d4b2cffc8535..."
  }
}
```
#### You can find other API working on http://mexo.onrender.com
## Author
### Mehul Pathak
