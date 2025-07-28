import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          address: string;
          phone: string;
          email: string;
          total_bills: number;
          total_amount: number;
          paid_amount: number;
          pending_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string;
          phone?: string;
          email?: string;
          total_bills?: number;
          total_amount?: number;
          paid_amount?: number;
          pending_amount?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          phone?: string;
          email?: string;
          total_bills?: number;
          total_amount?: number;
          paid_amount?: number;
          pending_amount?: number;
          created_at?: string;
        };
      };
      bills: {
        Row: {
          id: string;
          bill_no: string;
          client_id: string;
          client_name: string;
          client_address: string;
          date: string;
          items: any[];
          total_amount: number;
          total_advance: number;
          total_actual: number;
          paid_amount: number;
          pending_amount: number;
          status: 'pending' | 'partial' | 'paid';
          created_at: string;
        };
        Insert: {
          id?: string;
          bill_no: string;
          client_id: string;
          client_name: string;
          client_address?: string;
          date: string;
          items?: any[];
          total_amount?: number;
          total_advance?: number;
          total_actual?: number;
          paid_amount?: number;
          pending_amount?: number;
          status?: 'pending' | 'partial' | 'paid';
          created_at?: string;
        };
        Update: {
          id?: string;
          bill_no?: string;
          client_id?: string;
          client_name?: string;
          client_address?: string;
          date?: string;
          items?: any[];
          total_amount?: number;
          total_advance?: number;
          total_actual?: number;
          paid_amount?: number;
          pending_amount?: number;
          status?: 'pending' | 'partial' | 'paid';
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          client_id: string;
          bill_id: string;
          amount: number;
          date: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          bill_id: string;
          amount: number;
          date: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          bill_id?: string;
          amount?: number;
          date?: string;
          description?: string;
          created_at?: string;
        };
      };
      company_settings: {
        Row: {
          id: string;
          name: string;
          address: string;
          phone: string;
          phone2: string;
          email: string;
          pan_no: string;
          bank_name: string;
          account_no: string;
          ifsc_code: string;
          bank_branch: string;
          proprietor: string;
          logo: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string;
          address?: string;
          phone?: string;
          phone2?: string;
          email?: string;
          pan_no?: string;
          bank_name?: string;
          account_no?: string;
          ifsc_code?: string;
          bank_branch?: string;
          proprietor?: string;
          logo?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          phone?: string;
          phone2?: string;
          email?: string;
          pan_no?: string;
          bank_name?: string;
          account_no?: string;
          ifsc_code?: string;
          bank_branch?: string;
          proprietor?: string;
          logo?: string;
          updated_at?: string;
        };
      };
      bill_counter: {
        Row: {
          id: string;
          counter: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          counter?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          counter?: number;
          updated_at?: string;
        };
      };
    };
  };
}