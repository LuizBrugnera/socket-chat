import { serverHttp } from "./http";
import "./websocket";

const port = process.env.PORT || 3005;

serverHttp.listen(port, () => {
  console.log("Server is running on port " + port);
});
