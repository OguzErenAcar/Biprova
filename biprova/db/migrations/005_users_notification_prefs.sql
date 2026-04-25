alter table users
  add column notif_inapp boolean not null default true,
  add column notif_email boolean not null default true,
  add column notif_push  boolean not null default false;
