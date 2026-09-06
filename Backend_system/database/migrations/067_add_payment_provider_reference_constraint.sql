CREATE UNIQUE INDEX uq_payment_attempts_provider_reference
    ON public.payment_attempts(provider, provider_reference)
    WHERE provider IS NOT NULL
      AND provider_reference IS NOT NULL;