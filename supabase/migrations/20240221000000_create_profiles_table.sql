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

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to sync existing users with profiles
CREATE OR REPLACE FUNCTION public.sync_users_profiles()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  users_synced integer;
BEGIN
  INSERT INTO public.profiles (id, email, name)
  SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'name', email)
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );
  
  GET DIAGNOSTICS users_synced = ROW_COUNT;
  RETURN users_synced;
END;
$$;

-- Create function to sync profiles
CREATE OR REPLACE FUNCTION public.sync_profiles()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profiles_created integer;
BEGIN
  WITH new_profiles AS (
    INSERT INTO public.profiles (id, email, name)
    SELECT 
      id,
      email,
      COALESCE(raw_user_meta_data->>'name', email) as name
    FROM auth.users u
    WHERE NOT EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = u.id
    )
    RETURNING id
  )
  SELECT COUNT(*) INTO profiles_created FROM new_profiles;
  
  RETURN profiles_created;
END;
$$; 