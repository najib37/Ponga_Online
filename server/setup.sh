#!/bin/bash

npx prisma generate
npx prisma db push
npm run build
npm run start:prod
