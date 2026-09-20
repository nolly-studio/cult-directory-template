CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL CHECK (location = 'Seattle'),
  description TEXT,
  website TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT now()
);
