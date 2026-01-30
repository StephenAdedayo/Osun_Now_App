redisClient.set("name", "Stephen").then(() => console.log("Data gotten")).catch(err => console.log(err.message))

redisClient.get("name").then(data => console.log(data)).catch(err => console.log(error.message))