# Database Setup Guide

This project supports both local MongoDB and MongoDB Atlas configurations for different environments.

## **Recommended Setup:**

- **Development**: Local MongoDB (faster, offline-capable)
- **Production**: MongoDB Atlas (managed, scalable)

## 🔧 **Local MongoDB Setup (Recommended for Development)**

### Option 1: Install MongoDB Community Server

1. **Download & Install MongoDB:**
   - Windows: https://www.mongodb.com/try/download/community
   - macOS: `brew install mongodb-community`
   - Linux: Follow official MongoDB installation guide

2. **Start MongoDB Service:**
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS/Linux
   mongod --dbpath ~/data/db
   
   # Or if installed via brew (macOS)
   brew services start mongodb-community
   ```

3. **Verify Connection:**
   ```bash
   mongo --eval "db.runCommand('ping')"
   ```

## ☁️ **MongoDB Atlas Setup (Production)**

1. **Create Atlas Account:** https://www.mongodb.com/atlas
2. **Create Free Cluster**
3. **Get Connection String:**
   - Database Access → Add User
   - Network Access → Add IP (0.0.0.0/0 for development)
   - Clusters → Connect → Connect Application
4. **Update `.env.production` with your Atlas URI**

## **Environment Configuration**

### Development (.env.development)
```env
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/techjobhub_dev
# ... other configs
```

### Production (.env.production)  
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/techjobhub_prod
# ... other configs
```

## **Running the Application**

```bash
# Development with local MongoDB (default)
pnpm run dev

# Development with local MongoDB (explicit)
pnpm run dev:local

# Development with Atlas (if needed)
pnpm run dev:atlas

# Production
pnpm start
```

## **Database Management Tools**

### For Local MongoDB:
- **MongoDB Compass** (GUI): https://www.mongodb.com/products/compass
- **MongoDB Shell**: `mongosh` or legacy `mongo`

### For MongoDB Atlas:
- **Atlas Web Interface**: Built-in GUI
- **MongoDB Compass**: Can connect to Atlas clusters
- **VS Code Extension**: MongoDB for VS Code

## **Troubleshooting**

### Local MongoDB Issues:
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB manually
mongod --dbpath ~/data/db --port 27017

# Check logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

### Connection Issues:
- Verify MongoDB is running on correct port (27017)
- Check firewall settings
- Ensure correct database name in connection string

## **Pro Tips**

1. **Use different database names** for dev/test/prod environments
2. **Keep Atlas credentials secure** - never commit to version control
3. **Use connection pooling** for production (already configured in db.js)
4. **Monitor Atlas usage** to stay within free tier limits
5. **Set up automatic backups** in Atlas for production data
