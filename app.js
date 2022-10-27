const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const https = require("https");

const app = express();

const port = process.env.PORT || 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//Setup static directory to serve
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/signup.html"));
});

app.post("/", (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/82e6dca5110";
  const options = {
    method: "post",
    auth: "ismail:8e2d25c9ed173fb1a80f39f3aa9aef0b-us21",
  };
  const request = https.request(url, options, (response) => {
    response.statusCode === 200
      ? res.sendFile(path.join(__dirname, "public/html/success.html"))
      : res.sendFile(path.join(__dirname, "public/html/failure.html"));
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => res.redirect("/"));

app.listen(port, () => console.log("Server is running on port " + port));
