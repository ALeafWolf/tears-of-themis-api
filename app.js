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
    _id: Schema.Types.ObjectId,
    id: String,
    name: String,
    nameEN: String,
    type: String,
    rarity: String,
    character: String,
    characterEN: String,
    skills: [String],
    influence: String,
    defense: String,
    obtainedFrom: Array,
}, {
    toJSON: {
        virtuals: true,
    },
});
const SkillSchema = new Schema({
    _id: Schema.Types.ObjectId,
    ref: String,
    name: String,
    nameEN: String,
    character: String,
    type: String,
    rarity: Array,
    description: String,
    descriptionEN: String,
    nums: Array,
    function: String
});
CardSchema.virtual('skillObj', {
    ref: 'skills',
    localField: 'skills',
    foreignField: 'name'
});
const Card = mongoose.model("cards", CardSchema);
const Skill = mongoose.model(`skills`, SkillSchema);

const CardPoolHistorySchema = new Schema({
    startDate: String,
    endDate: String,
    type: String,
    cards: Array,
    bid: String,
    bv: String,
    twitter: String,
    youtube: String
}, {
    toJSON: {
        virtuals: true,
    },
});
CardPoolHistorySchema.virtual('cardObj', {
    ref: 'cards',
    localField: 'cards',
    foreignField: 'name'
});
const CardPoolHistory = mongoose.model(`card_pool_history`, CardPoolHistorySchema, `card_pool_history`);

const MerchSchema = new Schema({
    name: String,
    series: String,
    productMaterial: String,
    productTechnology: String,
    productPacking: String,
    productSize: String,
    productDescription: String,
    price: String,
    sellDate: Number,
    character: String,
    images: [String],
    weibo: String,
    hoyolab: String,
    tmall: String
}, {
    toJSON: {
        virtuals: true,
    },
});
const MerchSeriesSchema = new Schema({
    _id: String,
    name: String,
    type: String,
    typeEN: String,
    sellTime: [String]
});
const MerchSeries = mongoose.model(`merch_series`, MerchSeriesSchema);
MerchSchema.virtual('seriesObj', {
    ref: 'merch_series',
    localField: 'series',
    foreignField: 'name',
    justOne: true
});
const Merch = mongoose.model(`merchs`, MerchSchema);


app.get("/", (req, res) => {
    res.status(200).send({ "message": "Welcome to Tears of Themis API. Author: ALeafWolf" })
});

app.get("/api", (req, res) => {
    res.status(200).send({ "message": "Welcome to Tears of Themis API. Author: ALeafWolf" })
});

/*--------------------Card--------------------*/
// GET cards in all language
app.get("/api/cards", (req, res) => {
    Card.find().populate({ path: 'skillObj', select: '_id ref' }).exec().then(
        (results) => {
            res.status(200).send(results);
        }
    ).catch(
        (err) => {
            res.status(500).send({ "message": "Error when getting cards from database." })
        }
    )
});

//GET one card in all language
app.get("/api/card/:id", (req, res) => {
    let input = req.params.id;
    Card.find({ '_id': input }).populate({ path: 'skillObj', select: '_id ref nameEN character type description descriptionEN nums' }).exec().then(
        (results) => {
            if (results.length === 0) {
                res.status(404).send({ "message": `Card ${input} does not found` })
            } else {
                res.status(200).send(results[0]);
            }
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send({ "message": "Error when getting cards from database." })
        }
    )
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
app.get("/api/skill/:id", (req, res) => {
    let input = req.params.id;
    Skill.find({ "_id": input }).exec().then(
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

/*--------------------Vision History--------------------*/
// GET rate up vision history for all servers
app.get("/api/visionhistory", (req, res) => {
    CardPoolHistory.find().populate({ path: 'cardObj', select: '_id id character' }).exec().then(
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

/*--------------------Merch--------------------*/
//GET ALL merchs
app.get("/api/merchs", (req, res) => {
    Merch.find().populate({ path: 'seriesObj', select: 'name type' }).exec().then(
        (results) => {
            res.status(200).send(results);
        }
    ).catch(
        (err) => {
            res.status(500).send({ 'message': `Error when getting merchs from database.\n${err}` })
        }
    )
});

//GET one merch
app.get("/api/merch/:id", (req, res) => {
    let input = req.params.id;
    Merch.find({ '_id': input }).populate({ path: 'seriesObj', select: 'sellTime' }).exec().then(
        (results) => {
            if (results.length === 0) {
                res.status(404).send({ "message": `Merch ${input} does not found` })
            } else {
                res.status(200).send(results[0]);
            }
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send({ "message": "Error when getting merch from database." })
        }
    )
});

//GET ALL merch series
app.get("/api/merchseries", (req, res) => {
    MerchSeries.find().exec().then(
        (results) => {
            res.status(200).send(results);
        }
    ).catch(
        (err) => {
            res.status(500).send({ 'message': `Error when getting merchs from database.\n${err}` })
        }
    )
});