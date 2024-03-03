import { Logger, Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "./prisma.service";


@Module({
    imports : [PrismaClient],
    providers : [PrismaService, Logger],
    exports : [PrismaService, Logger],
})

export class PrismaModule {}
