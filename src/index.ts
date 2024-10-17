import { config } from "dotenv";
import { createServer } from "http";
config();

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = createServer((req, res) => {
    res.write("ok");
    res.end();
  });

  await app.listen(port);
  console.log(`Server is started at port ${port}`);
}

bootstrap();
