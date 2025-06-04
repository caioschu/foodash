/*
  # Create Restaurant Profiles Schema

  1. New Tables
    - `restaurant_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `restaurant_name` (text)
      - `phone_ddd` (text)
      - `phone_number` (text)
      - `whatsapp_ddd` (text)
      - `whatsapp_number` (text)
      - `website` (text)
      - `email` (text)
      - `cuisine_type` (text)
      - `employee_count` (integer)
      - `services` (jsonb)
      - `sales_channels` (jsonb)
      - `custom_channels` (text[])
      - `address` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on restaurant_profiles table
    - Add policies for authenticated users to manage their own profiles
*/

CREATE TABLE restaurant_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  restaurant_name text NOT NULL,
  phone_ddd text,
  phone_number text,
  whatsapp_ddd text,
  whatsapp_number text,
  website text,
  email text NOT NULL,
  cuisine_type text,
  employee_count integer,
  services jsonb DEFAULT '{"lunch": false, "dinner": false}'::jsonb,
  sales_channels jsonb,
  custom_channels text[],
  address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE restaurant_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON restaurant_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON restaurant_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON restaurant_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_restaurant_profiles_updated_at
  BEFORE UPDATE ON restaurant_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();