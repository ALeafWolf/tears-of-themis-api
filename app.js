const express = require("express");
var cors = require('cors')
const app = express();
app.use(express.json({
    type: ['application/json', 'text/plain']
}));
app.use(cors());

//mongo
const mongoose = require("mongoose");
const mongoURL = "mongodb+srv://user_01:uuc8PcWI9gW1cnkt@cluster0.vf3iw.mongodb.net/ToT?retryWrites=true&w=majority"
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }

const HTTP_PORT = process.env.PORT || 8080;
const onHttpStart = () => {
    console.log(`Server has started and is listening on port ${HTTP_PORT}`)
}

mongoose.connect(mongoURL, connectionOptions).then(
    () => {
        console.log("Connection success")
        app.listen(HTTP_PORT, onHttpStart);
    }
).catch(
    (err) => {
        console.log("Error connecting to database")
        console.log(err)
    }
)

const Schema = mongoose.Schema;

const CardSchema = new Schema({
    id: String,
    name: String,
    type: String,
    rarity: String,
    character: String,
    skills: Array,
    attack: String,
    defence: String,
    obtainedFrom: Array,
})
const Card = mongoose.model("cards", CardSchema)

const SkillSchema = new Schema({
    id: String,
    name: String,
    character: String,
    type: String,
    rarity: Array,
    description: String,
    nums: Array,
    function: String
})
const Skill = mongoose.model(`skills`, SkillSchema)

const SkillRssSchema = new Schema({
    rarity: String,
    rss: Array
})
const SkillRss = mongoose.model(`skill_level_up_rss`, SkillRssSchema, `skill_level_up_rss`)

const CardPoolHistorySchema = new Schema({
    startDate: String,
    endDate: String,
    type: String,
    cards: Array
})
const CardPoolHistory = mongoose.model(`card_pool_history`, CardPoolHistorySchema, `skill_level_up_rss`)

app.get("/api", (req, res) => {
    res.status(200).send({"message": "Welcome to Tears of Themis API."})
});

// GET cards
app.get("/api/cn/cards", (req, res) => {
    Card.find().exec().then(
        (results) => {
            res.status(200).send(results);
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send("Error when getting cards from database.")
        }
    )
});

//GET one card
app.get("/api/cn/card/:name", (req, res) => {
    let input = req.params.name;
    Card.find({ name: input }).exec().then(
        (results) => {
            if (results.length === 0) {
                res.status(404).send({"message": `${input} does not found`})
            } else {
                res.status(200).send(results);
            }
        }
    ).catch(
        (err) => {
            console.log(err)
        }
    )
});

//GET one card: wrong format
app.get("/api/cn/cards/:name", (req, res) => {
    res.status(200).send({"message": `For find one card, use /card/:name`})
});

//GET skills
app.get("/api/cn/skills", (req, res) => {
    Skill.find().exec().then(
        (results) => {
            res.status(200).send(results);
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send("Error when getting skills from database.")
        }
    )
});

//GET one skill
app.get("/api/cn/skill/:name", (req, res) => {
    let input = req.params.name;
    Skill.find({ name: input }).exec().then(
        (results) => {
            if (results.length === 0) {
                res.status(404).send({"message": `${input} does not found`})
            } else {
                res.status(200).send(results);
            }
        }
    ).catch(
        (err) => {
            console.log(err)
        }
    )
});

//GET one skill: wrong format
app.get("/api/cn/skills/:name", (req, res) => {
    res.status(200).send({"message": `For find one skill, use /cards/:name`})
});


// GET skill level up resourse
app.get("/api/skillrss", (req, res) => {
    SkillRss.find().exec().then(
        (results) => {
            res.status(200).send(results);
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send("Error when getting skill level up resourse from database.")
        }
    )
});

// GET card pool history
app.get("/api/cn/poolhistory", (req, res) => {
    CardPoolHistory.find().exec().then(
        (results) => {
            res.status(200).send(results);
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send("Error when getting card pool history from database.")
        }
    )
});