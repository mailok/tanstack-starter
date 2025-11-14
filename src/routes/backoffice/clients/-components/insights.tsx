import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Clock, RotateCcw, UserCheck, Users, UserX } from 'lucide-react';
import { Suspense } from 'react';
import { clientQuieries } from '../-queries'
import { useSuspenseQuery } from '@tanstack/react-query';

const summaryItems = [
	{
		key: 'total' as const,
		label: 'Total Clients',
		icon: Users,
		colorClass: 'text-blue-600',
		bgClass: 'bg-blue-100'
	},
	{
		key: 'active' as const,
		label: 'Active',
		icon: UserCheck,
		colorClass: 'text-green-600',
		bgClass: 'bg-green-100'
	},
	{
		key: 'pending' as const,
		label: 'Pending',
		icon: Clock,
		colorClass: 'text-orange-600',
		bgClass: 'bg-orange-100'
	},
	{
		key: 'inactive' as const,
		label: 'Inactive',
		icon: UserX,
		colorClass: 'text-red-600',
		bgClass: 'bg-red-100'
	}
];



export function Insights() {
	return (
		<Suspense fallback={<InsightsSkeleton />}>
			<InsightsCards />
		</Suspense>
	);
}

export function InsightsCards() {
	const { data: insights } = useSuspenseQuery(clientQuieries.insights());
	

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{summaryItems.map((item) => {
				const Icon = item.icon;
				const value = insights[item.key];

				return (
					<Card key={item.key} className="card-elevated status-indicator">
						<CardContent className="p-6">
							<div className="flex items-center space-x-4">
								<div
									className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bgClass}`}
								>
									<Icon className={`h-6 w-6 ${item.colorClass}`} />
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">{item.label}</p>
									<p className="text-2xl font-bold text-foreground">{value}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}

export function InsightsSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{summaryItems.map((item) => (
				<Card key={item.key} className="card-elevated">
					<CardContent className="p-6">
						<div className="flex items-center space-x-4">
							<Skeleton className="h-12 w-12 rounded-lg" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-6 w-8" />
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

export function InsightsError({ onRetry, error }: { error?: Error; onRetry: () => void }) {
	return (
		<div className="space-y-4">
			{/* Error message and retry button */}
			<div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
				<div className="flex items-center space-x-3">
					<AlertTriangle className="h-5 w-5 text-red-600" />
					<div>
						<p className="text-sm font-medium text-red-800">Error loading client data</p>
						{error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
					</div>
				</div>
				<Button
					onClick={onRetry}
					variant="outline"
					size="sm"
					className="border-red-300 text-red-700 hover:bg-red-100"
				>
					<RotateCcw className="mr-2 h-4 w-4" />
					Retry
				</Button>
			</div>

			{/* Error state cards with opacity */}
			<div className="grid grid-cols-1 gap-4 opacity-60 sm:grid-cols-2 lg:grid-cols-4">
				{summaryItems.map((item) => {
					return (
						<Card key={item.key} className="card-elevated status-indicator">
							<CardContent className="p-6">
								<div className="flex items-center space-x-4">
									<div
										className={`flex h-12 w-12 items-center justify-center rounded-lg bg-red-100`}
									>
										<AlertTriangle className="h-6 w-6 text-red-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">{item.label}</p>
										<p className="text-2xl font-bold text-foreground">0</p>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
