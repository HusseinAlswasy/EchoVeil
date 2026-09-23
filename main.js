import app from "./src/app.js";
import { PORT } from "./config/config.service.js";

app.listen(PORT, () => {
    console.log(`App Work Successfully on port : ${PORT}`);
});