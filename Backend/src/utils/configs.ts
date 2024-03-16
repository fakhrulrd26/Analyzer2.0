import dotenv from 'dotenv'
dotenv.config()

export default {
  developer: {
    email: process.env.DEV_EMAIL === undefined ? 'slimysmellyjellybelly@gmail.com' : process.env.DEV_EMAIL
  },
  database: {
    postgres: process.env.DATABASE_URL === undefined ? 'postgresql://postgres:root@localhost:5432/filesignature' : process.env.DATABASE_URL
  },
  server: {
    port: process.env.PORT === undefined ? 7000 : process.env.PORT
  },
  bcrypt: {
    salt: process.env.BCRYPT_SALT === undefined ? '$2b$10$1/4o27jmhscGEgTyF54NQurLbZvXI9zFROZKhlm0EoHsBE24NTAVu' : process.env.BCRYPT_SALT
  },
  jwt: {
    access_secret: process.env.ACCESS_SECRET === undefined ? 1999 : process.env.ACCESS_SECRET,
    refresh_secret: process.env.REFRESH_SECRET === undefined ? 9991 : process.env.REFRESH_SECRET,
    access_token_age: process.env.ACCESS_TOKEN_AGE === undefined ? '30m' : process.env.ACCESS_TOKEN_AGE,
    refresh_token_age: process.env.REFRESH_TOKEN_AGE === undefined ? '7d' : process.env.REFRESH_TOKEN_AGE
  },
  multer: {
    limit_files: process.env.LIMIT_FILES === undefined ? 3 : +process.env.LIMIT_FILES
  }
}
