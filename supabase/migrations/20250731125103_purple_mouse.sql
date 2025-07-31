@@ .. @@
 ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
 ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
 ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
 ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
 ALTER TABLE bill_counter ENABLE ROW LEVEL SECURITY;
 
 -- Create RLS policies
-CREATE POLICY "Users can manage clients" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
-CREATE POLICY "Users can manage bills" ON bills FOR ALL TO authenticated USING (true) WITH CHECK (true);
-CREATE POLICY "Users can manage payments" ON payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
-CREATE POLICY "Users can manage company settings" ON company_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
-CREATE POLICY "Users can manage bill counter" ON bill_counter FOR ALL TO authenticated USING (true) WITH CHECK (true);
+-- Clients policies
+CREATE POLICY "Authenticated users can select clients" ON clients FOR SELECT TO authenticated USING (true);
+CREATE POLICY "Authenticated users can insert clients" ON clients FOR INSERT TO authenticated WITH CHECK (true);
+CREATE POLICY "Authenticated users can update clients" ON clients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
+CREATE POLICY "Authenticated users can delete clients" ON clients FOR DELETE TO authenticated USING (true);
+
+-- Bills policies
+CREATE POLICY "Authenticated users can select bills" ON bills FOR SELECT TO authenticated USING (true);
+CREATE POLICY "Authenticated users can insert bills" ON bills FOR INSERT TO authenticated WITH CHECK (true);
+CREATE POLICY "Authenticated users can update bills" ON bills FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
+CREATE POLICY "Authenticated users can delete bills" ON bills FOR DELETE TO authenticated USING (true);
+
+-- Payments policies
+CREATE POLICY "Authenticated users can select payments" ON payments FOR SELECT TO authenticated USING (true);
+CREATE POLICY "Authenticated users can insert payments" ON payments FOR INSERT TO authenticated WITH CHECK (true);
+CREATE POLICY "Authenticated users can update payments" ON payments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
+CREATE POLICY "Authenticated users can delete payments" ON payments FOR DELETE TO authenticated USING (true);
+
+-- Company settings policies
+CREATE POLICY "Authenticated users can select company_settings" ON company_settings FOR SELECT TO authenticated USING (true);
+CREATE POLICY "Authenticated users can insert company_settings" ON company_settings FOR INSERT TO authenticated WITH CHECK (true);
+CREATE POLICY "Authenticated users can update company_settings" ON company_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
+CREATE POLICY "Authenticated users can delete company_settings" ON company_settings FOR DELETE TO authenticated USING (true);
+
+-- Bill counter policies
+CREATE POLICY "Authenticated users can select bill_counter" ON bill_counter FOR SELECT TO authenticated USING (true);
+CREATE POLICY "Authenticated users can insert bill_counter" ON bill_counter FOR INSERT TO authenticated WITH CHECK (true);
+CREATE POLICY "Authenticated users can update bill_counter" ON bill_counter FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
+CREATE POLICY "Authenticated users can delete bill_counter" ON bill_counter FOR DELETE TO authenticated USING (true);