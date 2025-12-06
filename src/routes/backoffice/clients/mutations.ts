export const clientMutationKeys = {
  all: ['client-mutations'] as const,
  onboarding: {
    all: () => ['client-onboarding'] as const,
    create: () => [...clientMutationKeys.onboarding.all(), 'create'] as const,
    updatePersonal: (id: string) =>
      [...clientMutationKeys.onboarding.all(), id, 'personal'] as const,
    updateMedical: (id: string) =>
      [...clientMutationKeys.onboarding.all(), id, 'medical'] as const,
    updateBenefits: (id: string) =>
      [...clientMutationKeys.onboarding.all(), id, 'benefits'] as const,
  },
}
