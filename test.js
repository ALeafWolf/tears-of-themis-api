// const mongoose = require("mongoose");
// const mongoURL = "mongodb+srv://user_01:uuc8PcWI9gW1cnkt@cluster0.vf3iw.mongodb.net/ToT?retryWrites=true&w=majority"
// const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
// const app = require("./app")

// mongoose.connect(mongoURL, connectionOptions).then(
//     () => {
//         console.log("Connection success")
//         app.listen(HTTP_PORT, onHttpStart);
//     }
// ).catch(
//     (err) => {
//         console.log("Error connecting to database")
//         console.log(err)
//     }
// )

// beforeAll(async() => {

// })

describe("Testing the default parameter", () => {
    it("Display welcome message", () => {
        expect(3).toBe(3);
    })
})