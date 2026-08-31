const fs = require('fs');
const path = require('path');
const seedData = require('./seed');

const DB_FILE = path.join(__dirname, '../data/db.json');

class Store {
  constructor() {
    this.init();
  }

  init() {
    try {
      const dataDir = path.dirname(DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (!fs.existsSync(DB_FILE)) {
        console.log('🌱 Initializing CLINORA database with seed data...');
        this.write(seedData);
      }
    } catch (err) {
      console.error('Error initializing store:', err);
    }
  }

  read() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.init();
      }
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to read db.json:', err);
      return seedData;
    }
  }

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('Failed to write db.json:', err);
      return false;
    }
  }

  resetToSeed() {
    this.write(seedData);
    return seedData;
  }

  getCollection(name) {
    const db = this.read();
    return db[name] || [];
  }

  findById(collectionName, id) {
    const items = this.getCollection(collectionName);
    return items.find(item => item.id === id || item.user_id === id);
  }

  findOne(collectionName, predicate) {
    const items = this.getCollection(collectionName);
    return items.find(predicate);
  }

  find(collectionName, predicate) {
    const items = this.getCollection(collectionName);
    return predicate ? items.filter(predicate) : items;
  }

  insert(collectionName, item) {
    const db = this.read();
    if (!db[collectionName]) {
      db[collectionName] = [];
    }
    db[collectionName].push(item);
    this.write(db);
    return item;
  }

  update(collectionName, idOrPredicate, updates) {
    const db = this.read();
    if (!db[collectionName]) return null;

    let index = -1;
    if (typeof idOrPredicate === 'function') {
      index = db[collectionName].findIndex(idOrPredicate);
    } else {
      index = db[collectionName].findIndex(item => item.id === idOrPredicate || item.user_id === idOrPredicate);
    }

    if (index === -1) return null;

    db[collectionName][index] = {
      ...db[collectionName][index],
      ...updates
    };

    this.write(db);
    return db[collectionName][index];
  }

  delete(collectionName, idOrPredicate) {
    const db = this.read();
    if (!db[collectionName]) return false;

    let index = -1;
    if (typeof idOrPredicate === 'function') {
      index = db[collectionName].findIndex(idOrPredicate);
    } else {
      index = db[collectionName].findIndex(item => item.id === idOrPredicate || item.user_id === idOrPredicate);
    }

    if (index === -1) return false;

    db[collectionName].splice(index, 1);
    this.write(db);
    return true;
  }
}

const store = new Store();
module.exports = store;
