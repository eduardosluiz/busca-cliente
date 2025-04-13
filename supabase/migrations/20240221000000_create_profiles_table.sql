-- Drop existing table if it exists
DROP TABLE IF EXISTS public.profiles;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name TEXT,
    email TEXT,
    company TEXT,
    phone TEXT,
    cpf TEXT,
    email_notifications BOOLEAN DEFAULT true,
    system_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_phone ON public.profiles(phone);
CREATE INDEX idx_profiles_cpf ON public.profiles(cpf);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert admin user profile
insert into public.profiles (id, name, company)
select 
    id,
    'Eduardo Luiz',
    'Evidence Assessoria'
from auth.users
where email = 'admin@example.com'
on conflict (id) do update
set 
    name = excluded.name,
    company = excluded.company,
    updated_at = now();

-- Drop existing function if it exists
drop function if exists public.create_profiles_table();

-- Create RPC function to create profiles table
create or replace function public.create_profiles_table()
returns boolean
language plpgsql
security definer
as $$
begin
  -- Create profiles table if it doesn't exist
  create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    name text,
    email text,
    company text,
    phone text,
    cpf text,
    email_notifications boolean default true,
    system_notifications boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Create indexes for better search performance
  create index if not exists idx_profiles_phone on public.profiles(phone);
  create index if not exists idx_profiles_cpf on public.profiles(cpf);

  -- Enable RLS
  alter table public.profiles enable row level security;

  -- Create policies
  drop policy if exists "Users can view own profile" on public.profiles;
  create policy "Users can view own profile"
    on public.profiles for select
    using (auth.uid() = id);

  drop policy if exists "Users can update own profile" on public.profiles;
  create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

  drop policy if exists "Users can insert own profile" on public.profiles;
  create policy "Users can insert own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

  -- Create updated_at trigger
  create or replace function public.handle_updated_at()
  returns trigger as $$
  begin
    new.updated_at = timezone('utc'::text, now());
    return new;
  end;
  $$ language plpgsql security definer;

  -- Create trigger
  drop trigger if exists handle_profiles_updated_at on public.profiles;
  create trigger handle_profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

  return true;
end;
$$; 