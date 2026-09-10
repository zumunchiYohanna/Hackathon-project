INSERT INTO public.business_verifications (
    business_id,
    status
)
SELECT
    b.id,
    CASE
        WHEN b.is_verified = TRUE
            THEN 'VERIFIED'::public.business_verification_status
        ELSE 'PENDING'::public.business_verification_status
    END
FROM public.businesses b
WHERE NOT EXISTS (
    SELECT 1
    FROM public.business_verifications bv
    WHERE bv.business_id = b.id
);

INSERT INTO public.schema_migrations (version, name)
VALUES ('076', 'initialize_business_verifications')
ON CONFLICT (version) DO NOTHING;