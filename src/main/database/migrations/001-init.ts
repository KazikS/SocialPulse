import { getDatabase } from "../connection";

const migration001 = `
CREATE TABLE IF NOT EXISTS platforms(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
slug TEXT);

CREATE TABLE IF NOT EXISTS sources(
id INTEGER PRIMARY KEY AUTOINCREMENT, 
platform_id INTEGER,
external_id TEXT,
name TEXT,
url TEXT,
created_at TEXT,
FOREIGN KEY (platform_id) REFERENCES platforms(id));

CREATE TABLE IF NOT EXISTS posts(
id INTEGER PRIMARY KEY AUTOINCREMENT,
source_id INTEGER,
external_id TEXT,
text TEXT,
published_at TEXT,
created_at TEXT,
FOREIGN KEY (source_id) REFERENCES sources(id));

CREATE TABLE IF NOT EXISTS post_media(
id INTEGER PRIMARY KEY AUTOINCREMENT,
post_id INTEGER,
type TEXT,
url TEXT,
FOREIGN KEY (post_id) REFERENCES posts(id));

CREATE TABLE IF NOT EXISTS post_stats(
id INTEGER PRIMARY KEY AUTOINCREMENT,
post_id INTEGER,
likes INTEGER,
reposts INTEGER,
collected_at TEXT,
FOREIGN KEY (post_id) REFERENCES posts(id));

CREATE TABLE IF NOT EXISTS post_comments(
id INTEGER PRIMARY KEY AUTOINCREMENT,
post_id INTEGER,
author TEXT,
text TEXT,
published_at TEXT,
FOREIGN KEY (post_id) REFERENCES posts(id));

CREATE TABLE IF NOT EXISTS source_stats(
id INTEGER PRIMARY KEY AUTOINCREMENT,
source_id INTEGER,
subscribers INTEGER,
posts_count INTEGER,
collected_at TEXT);
`;

export const createMigration = () => {
  getDatabase().exec(migration001);
};
