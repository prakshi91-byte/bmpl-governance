-- Lock down search_path on trigger helpers
alter function public.touch_updated_at() set search_path = public;

-- Revoke client-facing execute on functions only meant for triggers / RLS
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
-- has_role stays executable to authenticated because RLS policies reference it