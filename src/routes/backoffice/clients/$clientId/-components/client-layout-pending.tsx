import { HeaderInfoSkeleton } from './header-info'
import { DetailsNav } from './details-nav'
import { PersonalInformationSkeleton } from './personal-information'

export function ClientLayoutPending() {
  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <DetailsNav header={<HeaderInfoSkeleton />} disabled>
        <PersonalInformationSkeleton />
      </DetailsNav>
    </div>
  )
}
