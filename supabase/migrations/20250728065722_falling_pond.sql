/*
  # Initial Schema for Transport Billing System

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `phone` (text)
      - `email` (text)
      - `total_bills` (integer, default 0)
      - `total_amount` (numeric, default 0)
      - `paid_amount` (numeric, default 0)
      - `pending_amount` (numeric, default 0)
      - `created_at` (timestamp)

    - `bills`
      - `id` (uuid, primary key)
      - `bill_no` (text, unique)
      - `client_id` (uuid, foreign key)
      - `client_name` (text)
      - `client_address` (text)
      - `date` (date)
      - `items` (jsonb)
      - `total_amount` (numeric)
      - `total_advance` (numeric)
      - `total_actual` (numeric)
      - `paid_amount` (numeric, default 0)
      - `pending_amount` (numeric)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)

    - `payments`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key)
      - `bill_id` (uuid, foreign key)
      - `amount` (numeric)
      - `date` (date)
      - `description` (text)
      - `created_at` (timestamp)

    - `company_settings`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `phone` (text)
      - `phone2` (text)
      - `email` (text)
      - `pan_no` (text)
      - `bank_name` (text)
      - `account_no` (text)
      - `ifsc_code` (text)
      - `bank_branch` (text)
      - `proprietor` (text)
      - `logo` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  total_bills integer DEFAULT 0,
  total_amount numeric DEFAULT 0,
  paid_amount numeric DEFAULT 0,
  pending_amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_no text UNIQUE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_address text DEFAULT '',
  date date NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  total_amount numeric DEFAULT 0,
  total_advance numeric DEFAULT 0,
  total_actual numeric DEFAULT 0,
  paid_amount numeric DEFAULT 0,
  pending_amount numeric DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid')),
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  bill_id uuid REFERENCES bills(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  date date NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create company_settings table
CREATE TABLE IF NOT EXISTS company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text DEFAULT 'Khodiyar Enterprise',
  address text DEFAULT 'Transport Company Address',
  phone text DEFAULT '+91 98765 43210',
  phone2 text DEFAULT '',
  email text DEFAULT 'info@khodiyarenterprise.com',
  pan_no text DEFAULT 'ABCDE1234F',
  bank_name text DEFAULT 'State Bank of India',
  account_no text DEFAULT '1234567890',
  ifsc_code text DEFAULT 'SBIN0001234',
  bank_branch text DEFAULT 'Main Branch',
  proprietor text DEFAULT 'Proprietor Name',
  logo text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Create bill_counter table for auto-incrementing bill numbers
CREATE TABLE IF NOT EXISTS bill_counter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  counter integer DEFAULT 1000,
  updated_at timestamptz DEFAULT now()
);

-- Insert initial bill counter
INSERT INTO bill_counter (counter) VALUES (1000) ON CONFLICT DO NOTHING;

-- Insert default company settings
INSERT INTO company_settings (name) VALUES ('Khodiyar Enterprise') ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_counter ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can manage clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage bills"
  ON bills
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage company settings"
  ON company_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage bill counter"
  ON bill_counter
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bills_client_id ON bills(client_id);
CREATE INDEX IF NOT EXISTS idx_bills_bill_no ON bills(bill_no);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_bill_id ON payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);