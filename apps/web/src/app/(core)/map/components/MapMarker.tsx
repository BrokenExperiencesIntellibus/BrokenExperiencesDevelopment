import { getCategoryStyling } from "@web/lib/category-config";

interface MapMarkerProps {
	experience: any;
	onClick: (experience: any) => void;
}

export function MapMarker({ experience, onClick }: MapMarkerProps) {
	const categoryName = experience.category?.name || "Other";
	const categoryStyling = getCategoryStyling(categoryName);
	const IconComponent = categoryStyling.icon;

	// Simplified sizing for better performance
	const priority = experience.priority || 'medium';
	const sizeClass = priority === 'high' ? 'h-7 w-7' : 'h-6 w-6';
	const iconSize = priority === 'high' ? 'h-3.5 w-3.5' : 'h-3 w-3';

	return (
		<div
			className="custom-marker cursor-pointer transition-transform duration-150 hover:scale-110"
			onClick={(e) => {
				e.stopPropagation();
				onClick(experience);
			}}
		>
			<div
				className={`flex ${sizeClass} items-center justify-center rounded-full border-2 border-white shadow-md`}
				style={{ backgroundColor: categoryStyling.color }}
			>
				<IconComponent className={`${iconSize} text-white`} />
			</div>
		</div>
	);
}
