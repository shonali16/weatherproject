const http = require('http');
const fs = require('fs');
const requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=948ab5ed4233019198e92c08ee1135eb")
            .on("data", (chunk) => {

                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                const realTimeData = arrData
                    .map((val) => {
                        return replaceVal(homeFile, val);
                    })
                    .join(""); // Join the HTML fragments
                res.setHeader("Content-Type", "text/html");
                res.write(realTimeData); // Send the modified HTML response
                res.end();
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
            });
    }
});

server.listen(9000, "127.0.0.1", () => {
    console.log("Server is running at http://127.0.0.1:9000/");
});