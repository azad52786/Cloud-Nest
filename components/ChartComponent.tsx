"use client";
import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { UsageDetails } from "@/types";
import { convertFileSize } from "@/lib/utils";

const ChartComponent = ({ totalUsed }: { totalUsed: UsageDetails }) => {
	console.log(
		((Math.round(totalUsed.used) / totalUsed.totalSize) * 100).toFixed(2)
	);
	console.log(
		convertFileSize(totalUsed.totalSize - Math.round(totalUsed.used))
	);
	const chartData = [
		{
			browser: "free",
			visitors:
				((totalUsed.totalSize - totalUsed.used) / totalUsed.totalSize) * 100,
			fill: "var(--color-free)",
		},
		{
			browser: "images",
			visitors: (totalUsed.image.size / totalUsed.totalSize) * 100,
			fill: "var(--color-images)",
		},
		{
			browser: "media",
			visitors:
				(totalUsed.audio.size + totalUsed.video.size / totalUsed.totalSize) *
				100,
			fill: "var(--color-media)",
		},
		{
			browser: "other",
			visitors: (totalUsed.other.size / totalUsed.totalSize) * 100,
			fill: "var(--color-other)",
		},
		{
			browser: "documents",
			visitors: (totalUsed.document.size / totalUsed.totalSize) * 100,
			fill: "var(--color-documents)",
		},
	];

	const chartConfig = {
		documents: {
			label: "Documents",
			color: "#60A8FB",
		},
		images: {
			label: "Images",
			color: "#2563EB",
		},
		media: {
			label: "Media",
			color: "#3B86F7",
		},
		free: {
			label: "Free",
			color: "#90C7FE",
		},

		other: {
			label: "Other",
			color: "#BEDCFE",
		},
	} satisfies ChartConfig;
	return (
		<Card className="flex flex-row items-center bg-[#7288FA] border-none mt-2">
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey="visitors"
							nameKey="browser"
							innerRadius={60}
							strokeWidth={5}
							activeIndex={0}
							activeShape={({
								outerRadius = 0,
								...props
							}: PieSectorDataItem) => (
								<Sector {...props} outerRadius={outerRadius + 10} />
							)}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="flex font-bold text-gray-900 items-center gap-2 text-3xl leading-none">
					Available Storage
				</div>
				<div className=" font-bold text-2xl text-gray-950">
					{convertFileSize(totalUsed.totalSize - Math.round(totalUsed.used))} /
					2.0 GB
				</div>
			</CardFooter>
		</Card>
	);
};

export default ChartComponent;
