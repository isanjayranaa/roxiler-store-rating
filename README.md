#  Roxiler Store Rating

This is a full stack store rating website that I built as part of the Roxiler Systems Full Stack Developer Intern assignment.

The application has three types of users:
- Admin
- Normal User
- Store Owner

## Features

### Admin
- Login
- Dashboard
- Add users
- Add stores
- Upload store image
- Search and filter users
- Search and filter stores
- Sort data
- View store owner ratings

### Normal User
- Register and login
- View stores
- Search stores by name and address
- See overall store rating
- Give rating from 1 to 5
- Update rating
- View my ratings
- Change password

### Store Owner
- Login
- View store details
- See average rating
- See total ratings
- See users who rated the store
- Change password

## Tech Used

### Frontend
- React.js
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT
- bcrypt
- Multer
- Cloudinary

## Database

I used PostgreSQL for storing:

- Users
- Stores
- Ratings

A user can give only one rating to a store. If the user rates the same store again, the existing rating is updated.

## Store Images

Store images are uploaded using Multer and stored on Cloudinary.
