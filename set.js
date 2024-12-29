const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRUdReGtxSEFZMWdFS1BvbmlQZm4zYkxEcFdQczN1bEVVMXlGSFBpU2Jtdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiamFOMi9mbGw2WGhzSDZ1TTFvNFhMbmFEaUdseWlrTFQwSElxUG5obFQxOD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJPSDBPdTdJYWpJaExidFFyc0RjT2pHUUpzL3hEWGk0YWE1QmNZMUVnTVZrPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIxNEJuRXJPZCt4TzJaRVlyTC9YTWhWUDhmcldNMWY3bHBjb1N1UWREQUJzPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9CY2tBYWxVLzNRaW5aa1FVQVNXTldob3NPRW5GalQ2U09MOE5GUC9Mbk09In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InBpZm5YZEpILzNHcGt0bm44TTY2YWZKdHJLRTVCVzliWU1zWWdONlNPMms9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0xDM3Q2WGVyNWZVcExIYjRXQ01GeEdYSWYvR0Z4clJZbmNtMlVTdlgwbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVjI0aFA0VzZPems1dXl2MnRQZUczVUZOaW05bXNuV29QRFlwNEkwaVBIaz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IncxVVliWnFUNDZ5WXNZRm9zVTNFWDFpK1hUK3lwZHlQQURrVkJsSTZjOTBSS3c5cnF3eElEbTY4bTU5QzEwNGNuNzdjU0Nva3MyMmIzZEc4NU84NWpBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NTUsImFkdlNlY3JldEtleSI6ImtjVDJpaEowM3BsRzEwdDlhNlprZFZYcmZBWU95dFllbFRxeU5NQjlaOG89IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IndYTl83NnV2UzZxMWI2WFZHaklRZmciLCJwaG9uZUlkIjoiZTZlZDVhOWMtZDZjYy00MjljLWFhYzMtOTdlODQ1ZjBkODc2IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndaMTIvWnBpcGZ1cnRIQlZzRjJzTWlxTGE5OD0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJsa1V4OEl5eEhMT3NUK3R5YU5IWmtqSXN1Vlk9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiU1ZOSDY3UEwiLCJtZSI6eyJpZCI6IjI1NjcwODg1NTYwODoyMUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT2VIZzRZQkVPdXh4cnNHR0FvZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiVUlTUjdsYkJTeFE0NmFCdmZIczc0N2l5SWN5Y3l0dnY1ZUtWSE5UOStSVT0iLCJhY2NvdW50U2lnbmF0dXJlIjoicHMxV0YvelRlYjFsYm83RlkrMHpIMllZbVZIaGU1bGZ5UThKMStOUzlzSFBEU3dMaGJjZFh2aHRac1A1aEtGRTZ2ZkFZSmhMRG1vUlFKQTE2S0hJQkE9PSIsImRldmljZVNpZ25hdHVyZSI6Ik5YandWZ0pWV2NnT2tPTlFhcWNQRU52b0JNU2UrdDUwMll2Z2pOM21lVVNuTUdoVGdIS1RVUTdCTVNkRG93eXBEdGk4c2xrUWxBTW1Kc05PTHY0TGhnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU2NzA4ODU1NjA4OjIxQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlZDRWtlNVd3VXNVT09tZ2IzeDdPK080c2lITW5NcmI3K1hpbFJ6VS9ma1YifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzU0OTc5NzcsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQ01iIn0=',
    PREFIXE: process.env.PREFIX || "+",
    GITHUB : process.env.GITHUB|| 'https://github.com/Keithkeizzah/ALPHA-MD1',
    OWNER_NAME : process.env.OWNER_NAME || "Keith",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "256708855608",  
    ANTILINK : process.env.ANTILINK || "yes",
    ANTI_VV : process.env.ANTI_VV || "yes",               
    AUTO_REPLY : process.env.AUTO_REPLY || "yes",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    AUTO_REACT: process.env.AUTO_REACTION || "non",  
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'yes',              
    CHATBOT: process.env.CHAT_BOT || "off",              
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "yes",
    AUTO_BLOCK: process.env.BLOCK_ALL || 'yes',              
    GURL: process.env.GURL  || "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
    WEBSITE :process.env.GURL || "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
    CAPTION : process.env.CAPTION || "ALPHA-MD",
    BOT : process.env.BOT_NAME || 'ALPHA_MD',
    URL : process.env.BOT_MENU_LINKS || '',
    MODE: process.env.PUBLIC_MODE || "no",              
    TIMEZONE: process.env.TIMEZONE || "Africa/Nairobi", 
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME || null,
    HEROKU_API_KEY : process.env.HEROKU_API_KEY || null,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    GEMINI_API_KEY : process.env.GEMINI_API_KEY || 'AIzaSyCcZqDMBa8FcAdBxqE1o6YYvzlygmpBx14',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    ANTICALL: process.env.ANTICALL || 'yes',              
    CHAT_BOT : process.env.CHAT_BOT || 'no',  
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
