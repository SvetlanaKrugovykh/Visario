#create db
./psql -U postgres -h localhost -c "CREATE DATABASE visario WITH ENCODING='UTF8' LC_COLLATE='uk_UA.utf8' LC_CTYPE='uk_UA.utf8' TEMPLATE=template0;"


#connect to db
./psql -U postgres -d visario
# or
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d visario

#add extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

\q