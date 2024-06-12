
GRANT SELECT ON auth.users TO service_role;

do
$$
declare
    pg_role record;
begin
  for pg_role in select rolname from pg_roles
    loop 
      execute 'revoke all on function "public"."get_user_id_by_email" from ' || quote_ident(pg_role.rolname);
    end loop;
  grant EXECUTE ON function "public"."get_user_id_by_email" to service_role;
end;
$$
