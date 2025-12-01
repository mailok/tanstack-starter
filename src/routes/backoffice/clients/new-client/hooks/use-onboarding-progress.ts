import { useQuery } from "@tanstack/react-query";
import { getRouteApi, useMatchRoute } from "@tanstack/react-router";
import { clientQueries } from "../../queries";



export function useOnboardingProgress() {
    const matchRoute = useMatchRoute()
    const isNewClientRoute = matchRoute({ from: '/backoffice/clients/new-client' })
    
    if (isNewClientRoute) {
        return {
            activeStep: 1,
            completedSteps: [],
            isPending: false,
        }
    }

    const Route = getRouteApi('/backoffice/clients/new-client/$clientId/')
    const clientId = Route.useParams().clientId
    const { step } = Route.useSearch()
    
    const { data, isLoading, isFetching } = useQuery(
        clientQueries.onboardingProgress(clientId, step)
    )

    return {
        activeStep: data?.currentViewStep || 1,
        completedSteps: data?.completedSteps || [],
        isPending: isLoading || isFetching,
    }
    
}