ALTER TABLE public.business_users
RENAME TO business_users_legacy;

COMMENT ON TABLE public.business_users_legacy IS
'Legacy business membership model retained for historical compatibility. The MVP uses businesses.owner_user_id as the single operational business account relationship.';