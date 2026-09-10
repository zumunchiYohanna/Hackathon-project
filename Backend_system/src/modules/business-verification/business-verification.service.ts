import { AppError } from "../../utils/app-error";

import {
  findBusinessVerificationByBusinessId,
  findBusinessVerificationHistory,
  findBusinessVerifications,
  updateBusinessVerification
} from "./business-verification.repository";

import type {
  BusinessVerificationStatus,
  UpdateBusinessVerificationInput
} from "./business-verification.schemas";

export async function listBusinessVerifications(
  status?: BusinessVerificationStatus
) {
  return findBusinessVerifications(status);
}

export async function getBusinessVerification(
  businessId: string
) {
  const verification =
    await findBusinessVerificationByBusinessId(
      businessId
    );

  if (!verification) {
    throw new AppError(
      "Business verification record not found.",
      404,
      "BUSINESS_VERIFICATION_NOT_FOUND"
    );
  }

  const history =
    await findBusinessVerificationHistory(
      businessId
    );

  return {
    verification,
    history
  };
}

export async function reviewBusinessVerification(
  businessId: string,
  adminUserId: string,
  input: UpdateBusinessVerificationInput
) {
  try {
    return await updateBusinessVerification(
      businessId,
      adminUserId,
      input.status,
      input.notes ?? null
    );
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message ===
        "BUSINESS_VERIFICATION_NOT_FOUND"
    ) {
      throw new AppError(
        "Business verification record not found.",
        404,
        "BUSINESS_VERIFICATION_NOT_FOUND"
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "BUSINESS_VERIFICATION_NO_CHANGE"
    ) {
      throw new AppError(
        "The business already has this verification status.",
        409,
        "BUSINESS_VERIFICATION_NO_CHANGE"
      );
    }

    throw error;
  }
}