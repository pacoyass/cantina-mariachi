import path from "node:path";
import { defineConfig } from "prisma/config";
import dotenv from 'dotenv';
dotenv.config();
export default defineConfig({

   // ✅ Required: Enable the experimental features you are using.
//    experimental: {
//     // Enable if you're using a custom migrations path
//     adapter: true, 
//     // Enable if you're using the views feature
//     externalTables: true, 
//     // Enable if you're using a custom adapter for Studio
//     studio: true 
//   },

  // ✅ Your schema path
  schema: path.join("prisma", "schema.prisma"),
  
//   // ✅ Your custom migrations path
  migrations: {
  path: path.join("prisma", "migrations"),
  seed:`node prisma/seed.js` ,

  },

//   // ✅ Your custom views path
//   views: {
//     path: path.join("db", "views"),
//   },

//   // ✅ Your custom typedSql path
//   typedSql: {
//     path: path.join("db", "queries"),
//   }

});