var express = require("express");
var app = express();
var port = process.env.PORT || 7777;
var bodyParser = require("body-parser");
var Article = require("./db").Article;
var read = require("node-readability");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/css/bootstrap.css", express.static("node_modules/bootstrap/dist/css/bootstrap.css"));
app.set("port", port);

app.get("/articles", (req, res, next) => {
	Article.all((err, articles) => {
		if(err) return next(err);

		res.format({
			html() {
				res.render("articles.ejs", { articles: articles });
			},
			json() {
				res.send(articles);
			}
		})
	})
})

app.get("/articles/:id", (req, res, next) => {
	var id = req.params.id;

	Article.find(id, (err, article) => {
		if(err) return next(err);

		res.format({
			html() {
				res.render("article.ejs", { article: article });
			},
			json() {
				res.send(article);
			}
		})
	})
})

app.post("/articles", (req, res, next) => {
	var url = req.body.url;

	read(url, (err, result) => {
		if(err || !result) res.status(500).send("Error downloading article");

		Article.create({ title: result.title, content: result.content }, (err, article) => {
			if(err) return next(err);

			res.send("Ok");
		})
	})
})

app.delete("/articles/:id", (req, res, next) => {
	var id = req.params.id;

	Article.delete(id, (err) => {
		if(err) return next(err);

		res.send({ message: "Deleted" });
	})
})

app.listen(app.get("port"), () => {
	console.log(`Wep app available at localhost: ${port}`);
})