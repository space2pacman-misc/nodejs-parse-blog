var sqlite3 = require("sqlite3").verbose();
var dbName = "later.sqlite";
var db = new sqlite3.Database(dbName);

db.serialize(() => {
	var query = "CREATE TABLE IF NOT EXISTS articles (id integer primary key, title, content TEXT)";

	db.run(query);
})

class Article {
	static all(callback) {
		db.all("SELECT * FROM articles", callback);
	}

	static find(id, callback) {
		db.get("SELECT * FROM articles WHERE id = ?", id, callback);
	}

	static create(data, callback) {
		var query = "INSERT INTO articles(title, content) VALUES(?, ?)";

		db.run(query, data.title, data.content, callback);
	}

	static delete(id, callback) {
		db.run("DELETE FROM articles WHERE id = ?", id, callback);
	}
}

module.exports = {
	db: db,
	Article: Article
}