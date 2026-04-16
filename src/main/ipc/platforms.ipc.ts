import { PlatformsRepository } from "@main/database/repositories";

import { registerCRUD } from "./lib/registerCRUD";

registerCRUD("platforms", () => new PlatformsRepository());
