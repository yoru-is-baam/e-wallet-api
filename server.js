import app from "./src/app.js";
import config from "./src/configs/mongodb.config.js";

const PORT = config.app.port || 3000;

const server = app.listen(PORT, () => {
	console.log(`Server start with port ${PORT}`);
});

process.on("SIGINT", () => {
	server.close(() => console.log(`Exit Server Express`));
});
