import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://auwahlfkcyqcosakeqoi.supabase.co';
const supabaseAnonKey = 'sb_publishable_G6QH_Q1DizqMfZeynUqbIw_3BC4-ADp';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
