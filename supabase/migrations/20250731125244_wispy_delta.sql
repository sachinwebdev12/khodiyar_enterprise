/*
  # Fix RLS policies for anonymous users

  1. Security Changes
    - Update RLS policies to allow anonymous users to perform operations
    - Add policies for anon role on all tables
    - Ensure proper permissions for INSERT, SELECT, UPDATE, DELETE operations

  2. Tables Updated
    - clients: Allow anon users to manage client data
    - bills: Allow anon users to manage bill data  
    - payments: Allow anon users to manage payment data
    - company_settings: Allow anon users to manage settings
    - bill_counter: Allow anon users to manage counter
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read clients" ON clients;
DROP POLICY IF EXISTS "Users can insert clients" ON clients;
DROP POLICY IF EXISTS "Users can update clients" ON clients;
DROP POLICY IF EXISTS "Users can delete clients" ON clients;

DROP POLICY IF EXISTS "Users can read bills" ON bills;
DROP POLICY IF EXISTS "Users can insert bills" ON bills;
DROP POLICY IF EXISTS "Users can update bills" ON bills;
DROP POLICY IF EXISTS "Users can delete bills" ON bills;

DROP POLICY IF EXISTS "Users can read payments" ON payments;
DROP POLICY IF EXISTS "Users can insert payments" ON payments;
DROP POLICY IF EXISTS "Users can update payments" ON payments;
DROP POLICY IF EXISTS "Users can delete payments" ON payments;

DROP POLICY IF EXISTS "Users can read company_settings" ON company_settings;
DROP POLICY IF EXISTS "Users can insert company_settings" ON company_settings;
DROP POLICY IF EXISTS "Users can update company_settings" ON company_settings;
DROP POLICY IF EXISTS "Users can delete company_settings" ON company_settings;

DROP POLICY IF EXISTS "Users can read bill_counter" ON bill_counter;
DROP POLICY IF EXISTS "Users can insert bill_counter" ON bill_counter;
DROP POLICY IF EXISTS "Users can update bill_counter" ON bill_counter;
DROP POLICY IF EXISTS "Users can delete bill_counter" ON bill_counter;

-- Create new policies for anon users on clients table
CREATE POLICY "Allow anon to read clients"
  ON clients
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to insert clients"
  ON clients
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to update clients"
  ON clients
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to delete clients"
  ON clients
  FOR DELETE
  TO anon
  USING (true);

-- Create new policies for anon users on bills table
CREATE POLICY "Allow anon to read bills"
  ON bills
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to insert bills"
  ON bills
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to update bills"
  ON bills
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to delete bills"
  ON bills
  FOR DELETE
  TO anon
  USING (true);

-- Create new policies for anon users on payments table
CREATE POLICY "Allow anon to read payments"
  ON payments
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to insert payments"
  ON payments
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to update payments"
  ON payments
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to delete payments"
  ON payments
  FOR DELETE
  TO anon
  USING (true);

-- Create new policies for anon users on company_settings table
CREATE POLICY "Allow anon to read company_settings"
  ON company_settings
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to insert company_settings"
  ON company_settings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to update company_settings"
  ON company_settings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to delete company_settings"
  ON company_settings
  FOR DELETE
  TO anon
  USING (true);

-- Create new policies for anon users on bill_counter table
CREATE POLICY "Allow anon to read bill_counter"
  ON bill_counter
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to insert bill_counter"
  ON bill_counter
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to update bill_counter"
  ON bill_counter
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to delete bill_counter"
  ON bill_counter
  FOR DELETE
  TO anon
  USING (true);

-- Initialize bill counter if it doesn't exist
INSERT INTO bill_counter (counter) 
SELECT 1000 
WHERE NOT EXISTS (SELECT 1 FROM bill_counter);