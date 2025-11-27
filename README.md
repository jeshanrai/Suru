# StartUp Connect Hub 🚀

A full-stack MERN platform connecting startup founders with potential partners and collaborators.

## Features

- 🔐 **User Authentication** - JWT-based secure login/registration
- 💼 **Startup Listings** - Post and browse business ideas
- 🔍 **Advanced Filtering** - Search by category, location, skills
- 📝 **Application System** - Apply to join startups
- 📊 **User Dashboard** - Manage startups and applications
- 🎨 **Modern UI** - Responsive design with premium aesthetics
- 💬 **Real-time Chat** - Socket.io infrastructure (ready for integration)

## Tech Stack

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Socket.io
- bcrypt for password hashing

**Frontend:**
- React 18
- Vite
- React Router
- Axios
- Lucide Icons
- Custom CSS (no frameworks)

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd startup-connect
```

2. **Setup Backend**
```bash
cd server
npm install

# Create .env file
echo "PORT=5000
MONGO_URI=mongodb://localhost:27017/startup-connect
JWT_SECRET=your_secret_key_here" > .env

# Start server
node server.js
```

3. **Setup Frontend**
```bash
cd ../client
npm install

# Start dev server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
startup-connect/
├── server/              # Backend
│   ├── config/         # Database config
│   ├── controllers/    # Route controllers
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middlewares/    # Auth middleware
│   └── server.js       # Entry point
│
└── client/             # Frontend
    ├── src/
    │   ├── components/ # Reusable components
    │   ├── pages/      # Page components
    │   ├── context/    # React Context
    │   ├── utils/      # API utilities
    │   └── styles/     # CSS files
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Startups
- `GET /api/startups` - Get all startups
- `GET /api/startups/:id` - Get single startup
- `POST /api/startups` - Create startup (protected)

### Applications
- `POST /api/applications` - Apply to startup (protected)
- `GET /api/applications/my` - Get my applications (protected)
- `GET /api/applications/startup/:id` - Get applications for startup (protected)

## User Roles

1. **Founder** - Post startup ideas, manage applications
2. **Partner** - Browse startups, apply to join

## Features in Detail

### For Founders
- Post startup ideas with details
- Specify required skills and investment
- View and manage applications
- Track startup performance

### For Partners
- Browse available startups
- Filter by category, location, skills
- Apply with personalized messages
- Track application status

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/startup-connect
JWT_SECRET=your_jwt_secret_key
```

## Development

### Running in Development Mode

**Backend:**
```bash
cd server
node server.js
```

**Frontend:**
```bash
cd client
npm run dev
```

### Building for Production

```bash
cd client
npm run build
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- CORS enabled
- Input validation

## Future Enhancements

- [ ] Real-time chat implementation
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] File upload for images
- [ ] Advanced search filters
- [ ] Meeting scheduler
- [ ] Premium subscriptions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

## Support

For support, email your-email@example.com

---

Built with ❤️ using MERN Stack
