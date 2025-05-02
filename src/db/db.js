const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "socialPulse.db");

const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) return console.error(err.message);
    console.log("Подключение к базе данных успешно!");
  }
);

function initDB() {
  db.serialize(() => {
    db.run(`
          CREATE TABLE IF NOT EXISTS sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
          )`);

    db.run(`
          CREATE TABLE IF NOT EXISTS channels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            platform TEXT,
            external_id TEXT UNIQUE,
            title TEXT,
            link TEXT
          )`);

    db.run(`
          CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            source_id INTEGER,
            channel_id INTEGER,
            text TEXT,
            date TEXT,
            views INTEGER,
            likes INTEGER,
            comments INTEGER,
            reposts INTEGER,
            FOREIGN KEY (source_id) REFERENCES sources(id),
            FOREIGN KEY (channel_id) REFERENCES channels(id)
          )`);
  });
}

function ensureSource(name, callback) {
  db.run(`INSERT OR IGNORE INTO sources (name) VALUES (?)`, [name], () => {
    db.get(`SELECT id FROM sources WHERE name = ?`, [name], (err, row) => {
      callback(row.id);
    });
  });
}

function ensureChannel({ platform, external_id, title, link }, callback) {
  db.run(
    `INSERT OR IGNORE INTO channels (platform, external_id, title, link) VALUES (?, ?, ?, ?)`,
    [platform, external_id, title, link],
    () => {
      db.get(
        `SELECT id FROM channels WHERE external_id = ?`,
        [external_id],
        (err, row) => {
          callback(row.id);
        }
      );
    }
  );
}

function insertOrUpdatePost(post, sourceName, channelInfo) {
  ensureSource(sourceName, (source_id) => {
    ensureChannel(channelInfo, (channel_id) => {
      db.run(
        `INSERT INTO posts (id, source_id, channel_id, text, date, views, likes, comments, reposts)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             source_id = excluded.source_id,
             channel_id = excluded.channel_id,
             text = excluded.text,
             date = excluded.date,
             views = excluded.views,
             likes = excluded.likes,
             comments = excluded.comments,
             reposts = excluded.reposts`,
        [
          post.id,
          source_id,
          channel_id,
          post.text,
          post.date,
          post.views || 0,
          post.likes || 0,
          post.comments || 0,
          post.reposts || 0,
        ]
      );
    });
  });
}

function getPosts(from, to, callback) {
  db.run(
    `SELECT p.*, s.name AS source, c.title AS channel
     FROM posts p
     JOIN sources s ON p.source_id = s.id
     JOIN channels c ON p.channel_id = c.id
     WHERE date BETWEEN ? AND ?
     ORDER BY date ASC`,
    [from, to],
    (err, rows) => {
      callback(rows || []);
    }
  );
}

function deletePostsByIds(ids = []) {
  const placeholders = ids.map(() => "?").join(",");
  db.run(`DELETE FROM posts WHERE id IN (${placeholders})`, ids);
}

function getStatistics(from, to, channelId, callback) {
  db.get(
    `SELECT 
      COUNT(*) AS totalPosts,
      SUM(likes) AS totalLikes,
      SUM(comments) AS totalComments,
      SUM(views) AS totalViews,
      SUM(reposts) AS totalReposts
     FROM posts
     WHERE date BETWEEN ? AND ? AND channel_id = ?`,
    [from, to, channelId],
    (err, row) => {
      if (err) {
        console.error("Ошибка при подсчете статистики:", err.message);
        callback({
          totalPosts: 0,
          totalLikes: 0,
          totalComments: 0,
          totalViews: 0,
          totalReposts: 0,
        });
      } else {
        callback(
          row || {
            totalPosts: 0,
            totalLikes: 0,
            totalComments: 0,
            totalViews: 0,
            totalReposts: 0,
          }
        );
      }
    }
  );
}

function getChannelIdByExternalId(external_id, callback) {
  db.get(
    `SELECT id FROM channels WHERE external_id = ?`,
    [external_id],
    (err, row) => {
      if (err) {
        console.error("Ошибка при получении channel_id:", err.message);
        callback(null);
      } else {
        callback(row?.id || null);
      }
    }
  );
}

module.exports = {
  initDB,
  insertOrUpdatePost,
  getPosts,
  deletePostsByIds,
  getStatistics,
  getChannelIdByExternalId
};
