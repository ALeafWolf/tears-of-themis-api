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
    nameEN: String,
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
    nameEN: String,
    character: String,
    type: String,
    rarity: Array,
    description: String,
    descriptionEN: String,
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
    cards: Array,
    bid: String,
    bv: String
})
const CardPoolHistory = mongoose.model(`card_pool_history`, CardPoolHistorySchema, `card_pool_history`)

app.get("/", (req, res) => {
    res.status(200).send({ "message": "Welcome to Tears of Themis API." })
});

app.get("/api", (req, res) => {
    res.status(200).send({ "message": "Welcome to Tears of Themis API." })
});

/*--------------------Card--------------------*/
// GET cards in all language
app.get("/api/cards", (req, res) => {
    Card.find().exec().then(
        (results) => {
            res.status(200).send(results);
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send({"message": "Error when getting cards from database."})
        }
    )
});

//GET one card in all language
app.get("/api/card/:name", (req, res) => {
    let input = req.params.name;
    Card.find({ $or: [{ name: input }, { nameEN: input }] }).exec().then(
        (results) => {
            if (results.length === 0) {
                res.status(404).send({ "message": `${input} does not found` })
            } else {
                res.status(200).send(results[0]);
            }
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send({"message": "Error when getting cards from database."})
        }
    )
});

//GET one card for certain language
app.get("/api/:lang/card/:name", (req, res) => {
    let lang = req.params.lang;
    let input = req.params.name;
    Card.find({ name: input }).exec().then(
        (results) => {
            if (results.length === 0) {
                res.status(404).send({ "message": `${input} does not found` })
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
    res.status(200).send({ "message": `For find one card, use /card/:name` })
});


/*--------------------Skill--------------------*/
//GET skills in all language
app.get("/api/skills", (req, res) => {
    Skill.find().exec().then(
        (results) => {
            res.status(200).send(results);
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send({ "message": "Error when getting skills from database." })
        }
    )
});

//GET one skill in all language
app.get("/api/skill/:name", (req, res) => {
    let input = req.params.name;

    Skill.find({ $or: [{ name: input }, { nameEN: input }] }).exec().then(
        (results) => {
            if (results.length === 0) {
                res.status(404).send({ "message": `Skill ${input} does not found` })
            } else {
                res.status(200).send(results[0]);
            }
        }
    ).catch(
        (err) => {
            console.log(err)
        }
    )
});

//GET one skill: wrong format
app.get("/api/skills/:name", (req, res) => {
    res.status(200).send({ "message": `For find one skill, use /cards/:name` })
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
            res.status(500).send({ "message": "Error when getting skill level up resourse from database." })
        }
    )
});

/*--------------------Vision History--------------------*/
// GET rate up vision history for all servers
app.get("/api/visionhistory", (req, res) => {
    CardPoolHistory.find().exec().then(
        (results) => {
            res.status(200).send(results);
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send({ "message": "Error when getting card pool history from database." })
        }
    )
});
// GET rate up vision history for certain server
app.get("/api/visionhistory/:server", (req, res) => {
    let s = req.params.server
    CardPoolHistory.find({ server: s }).exec().then(
        (results) => {
            if (results.length == 0) {
                res.status(404).send({ "message": `No result find for vision history at server ${s}\nAvailable server paramters:\nCN as Chinese Mainland Server\nIN as International Server` });
            } else {
                res.status(200).send(results);
            }
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send({ "message": "Error when getting card pool history from database." })
        }
    )
});