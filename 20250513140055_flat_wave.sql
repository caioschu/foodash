/*
  # Create sales tracking tables

  1. New Tables
    - `sales_entries`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key to restaurant_profiles)
      - `date` (date)
      - `channel` (text)
      - `revenue` (numeric)
      - `orders` (integer)
      - `rating` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `payment_entries`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key to restaurant_profiles)
      - `date` (date)
      - `payment_type` (text)
      - `amount` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for restaurant owners to manage their own data
*/

-- Create sales_entries table
CREATE TABLE sales_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurant_profiles(id) NOT NULL,
  date date NOT NULL,
  channel text NOT NULL,
  revenue numeric(10,2) NOT NULL,
  orders integer NOT NULL,
  rating numeric(3,1),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payment_entries table
CREATE TABLE payment_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurant_profiles(id) NOT NULL,
  date date NOT NULL,
  payment_type text NOT NULL,
  amount numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sales_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for sales_entries
CREATE POLICY "Users can view own sales entries" ON sales_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_profiles
      WHERE id = sales_entries.restaurant_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own sales entries" ON sales_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurant_profiles
      WHERE id = sales_entries.restaurant_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own sales entries" ON sales_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurant_profiles
      WHERE id = sales_entries.restaurant_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own sales entries" ON sales_entries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurant_profiles
      WHERE id = sales_entries.restaurant_id
      AND user_id = auth.uid()
    )
  );

-- Create policies for payment_entries
CREATE POLICY "Users can view own payment entries" ON payment_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_profiles
      WHERE id = payment_entries.restaurant_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own payment entries" ON payment_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurant_profiles
      WHERE id = payment_entries.restaurant_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own payment entries" ON payment_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurant_profiles
      WHERE id = payment_entries.restaurant_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own payment entries" ON payment_entries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurant_profiles
      WHERE id = payment_entries.restaurant_id
      AND user_id = auth.uid()
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_sales_entries_updated_at
  BEFORE UPDATE ON sales_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_entries_updated_at
  BEFORE UPDATE ON payment_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();