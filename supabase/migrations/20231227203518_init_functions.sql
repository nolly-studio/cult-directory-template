-- Supabase rpc function to check if user has email. 
create or replace function get_user_id_by_email(user_email text) returns uuid
as $$
  declare
  user_id uuid;
begin
  select id 
  from auth.users 
  where email = user_email 
  into user_id;

  return user_id;
end;
$$ language plpgsql security invoker;

