import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjzonfmabpmkjuhieeef.supabase.co'; // get from Supabase project dashboard
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqem9uZm1hYnBta2p1aGllZWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxOTQ4MzEsImV4cCI6MjA2NDc3MDgzMX0.pJzFgutA9PSwORBytdO9KWz2WIrTCJYSE1WzO2h6wqA'; // get from Supabase > Project Settings > API

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
