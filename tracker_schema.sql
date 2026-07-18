CREATE TABLE IF NOT EXISTS prayer_quran_tracker (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id VARCHAR NOT NULL REFERENCES students(admission_number) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  day INTEGER NOT NULL,
  subh INTEGER DEFAULT 0,
  duhr INTEGER DEFAULT 0,
  asr INTEGER DEFAULT 0,
  magrib INTEGER DEFAULT 0,
  isha INTEGER DEFAULT 0,
  prayer_marks INTEGER DEFAULT 0,
  quran_pages INTEGER DEFAULT 0,
  quran_marks INTEGER DEFAULT 0,
  locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (student_id, month, year, day)
);

-- Enable RLS just in case (though Server Actions bypass it with Service Role)
ALTER TABLE prayer_quran_tracker ENABLE ROW LEVEL SECURITY;

-- Optional policy for anon/authenticated roles if ever used directly from client
CREATE POLICY "Students can view own tracker" 
ON prayer_quran_tracker 
FOR SELECT 
USING (
  auth.uid()::text = student_id 
  OR current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
);
