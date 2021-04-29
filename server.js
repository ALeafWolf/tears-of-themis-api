const app = require("./app")

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

const Schema = mongoose.Schema
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
const Skill = mongoose.model("skills", SkillSchema)