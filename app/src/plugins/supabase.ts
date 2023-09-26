import { createClient } from '@supabase/supabase-js'
import {Database} from "@/types/supabase.types";

export const supabase= createClient<Database>('https://rouarbdbmlahwttlyspf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvdWFyYmRibWxhaHd0dGx5c3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODgxMzA0NTcsImV4cCI6MjAwMzcwNjQ1N30.EJeMk5dCNptOMg0XXKvh62LwxB7ItnskM6jOwodddRI')