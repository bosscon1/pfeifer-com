create table if not exists site_settings (
  id text primary key,
  phone text not null,
  email text not null,
  address_line text not null,
  city_line text not null,
  hours text not null,
  service_area text not null,
  updated_at timestamptz not null default now(),
  updated_by text not null default ''
);
