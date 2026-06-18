begin;

alter table public.appointments
  add column if not exists citizen_email text;

update public.appointments as appointments
set citizen_email = users.email
from auth.users as users
where appointments.citizen_id = users.id
  and appointments.citizen_email is null;

commit;
