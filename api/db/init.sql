-- Enable the PostgreSQL extensions
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists users (
  fid text primary key,
  genres jsonb default '[]'::jsonb,
  favorite_team text,
  favorite_player text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Followed matches table
create table if not exists followed_matches (
  id uuid default uuid_generate_v4() primary key,
  fid text references users(fid),
  match_id text not null,
  created_at timestamptz default now(),
  unique(fid, match_id)
);

-- Notifications table for match reminders
create table if not exists notifications (
  id uuid default uuid_generate_v4() primary key,
  fid text references users(fid),
  match_id text not null,
  message text not null,
  notify_at timestamptz not null,
  sent boolean default false,
  created_at timestamptz default now()
);

-- Indexes for better query performance
create index if not exists followed_matches_fid_idx on followed_matches(fid);
create index if not exists notifications_notify_at_idx on notifications(notify_at) where not sent;

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at
create trigger update_users_updated_at
  before update on users
  for each row
  execute function update_updated_at_column();
