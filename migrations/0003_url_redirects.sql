create table if not exists url_redirects (
  id serial primary key,
  from_path text not null unique,
  to_path text,
  suggested_to text,
  status text not null default 'detected',
  source text not null default 'compare',
  note text not null default '',
  updated_at timestamptz not null default now(),
  updated_by text not null default ''
);
create index if not exists url_redirects_status_idx on url_redirects (status);
