// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the igrite-bg database
db = db.getSiblingDB('igrite-bg');

// Create a user for the application
db.createUser({
  user: 'igrite-user',
  pwd: 'igrite-password',
  roles: [
    {
      role: 'readWrite',
      db: 'igrite-bg'
    }
  ]
});

// Create indexes for better performance
db.games.createIndex({ "id": 1 }, { unique: true });
db.games.createIndex({ "title": "text", "description": "text", "tags": "text" });
db.games.createIndex({ "category": 1 });

db.categories.createIndex({ "name": 1 }, { unique: true });

print('MongoDB initialization completed successfully!');