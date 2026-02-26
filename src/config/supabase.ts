import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zeylyvekbpsmvxrejpfa.supabase.co';
const supabaseAnonKey = 'sb_publishable_FaNKH11b6zA9By-0D-3sbA_ppI6cBha';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
