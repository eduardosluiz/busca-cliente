-- Drop existing table if it exists
drop table if exists public.contacts;

-- Create contacts table
create table public.contacts (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    company_name text not null,
    fantasy_name text,
    category text not null,
    address jsonb not null,
    phone text,
    email text,
    website text,
    status text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(company_name, user_id)
);

-- Create indexes for better search performance
create index idx_contacts_user_id on public.contacts(user_id);
create index idx_contacts_company_name on public.contacts(company_name);
create index idx_contacts_fantasy_name on public.contacts(fantasy_name);
create index idx_contacts_category on public.contacts(category);
create index idx_contacts_status on public.contacts(status);
create index idx_contacts_phone on public.contacts(phone);
create index idx_contacts_email on public.contacts(email);

-- Enable RLS
alter table public.contacts enable row level security;

-- Create policies
create policy "Users can view their own contacts"
    on public.contacts for select
    using (auth.uid() = user_id);

create policy "Users can insert their own contacts"
    on public.contacts for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own contacts"
    on public.contacts for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own contacts"
    on public.contacts for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger
drop trigger if exists handle_contacts_updated_at on public.contacts;
create trigger handle_contacts_updated_at
    before update on public.contacts
    for each row
    execute function public.handle_updated_at(); 