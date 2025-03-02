import ActionDropdown from "@/components/ActionDropdown";
import ChartComponent from "@/components/ChartComponent";
import FormattedDateTime from "@/components/FormattedDateTime";
import PreviewImage from "@/components/PreviewImage";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalUsage } from "@/lib/file.action";
import { convertFileSize, getUsesSummary } from "@/lib/utils";
import { UsageDetails } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";

export default async function Home() {
	const [files, totalUsage]: Array<UsageDetails | Array<Models.Document>> =
		await Promise.all([getFiles({ types: [], limit: 7 }), getTotalUsage()]);

	const usageSummary = getUsesSummary(totalUsage as UsageDetails);
	return (
		<div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:gap-10 px-3">
			<section>
				<ChartComponent totalUsed={totalUsage as UsageDetails} />

				<ul className=" mt-2 grid grid-cols-1 gap-4 xl:mt-10 xl:grid-cols-2 xl:gap-9 ">
					{usageSummary.map((summary) => (
						<Link
							href={summary.url}
							key={summary.title}
							className=" relative mt-1 rounded-[20px] rounded-t-3xl bg-slate-800 text-gray-300 p-5 transition-all hover:scale-105 "
						>
							<div className="space-y-4">
								<div className="flex justify-between gap-3">
									<Image
										src={summary.icon}
										width={20}
										height={20}
										alt="uploaded image"
										className="absolute -left-3 top-[-9px] z-10 w-[190px] object-contain "
									/>
									<h4 className="h4 relative z-20 w-full text-right">
										{convertFileSize(summary.size) || 0}
									</h4>
								</div>

								<h5 className="h5 relative z-20 text-center">
									{summary.title}
								</h5>
								<Separator className=" bg-gray-300" />
								<FormattedDateTime
									date={summary.latestDate}
									className="text-center"
								/>
							</div>
						</Link>
					))}
				</ul>
			</section>

			<section className=" h-full rounded-[20px] bg-slate-800 text-gray-300 mt-2 p-5 xl:p-8">
				<h2 className="h3 xl:h2 text-indigo-500">Recent files uploaded</h2>
				{files.documents.length > 0 ? (
					<ul className="mt-5 flex flex-col gap-5">
						{files.documents.map((file: Models.Document) => (
							<Link
								href={file.url}
								target="_blank"
								className="flex items-center gap-3"
								key={file.$id}
							>
								<PreviewImage
									type={file.type}
									extension={file.extension}
									url={file.url}
								/>

								<div className="flex w-full flex-row justify-between">
									<div className="flex flex-col gap-1">
										<p className="recent-file-name">{file.name}</p>
										<FormattedDateTime
											date={file.$createdAt}
											className="caption "
										/>
									</div>
									<ActionDropdown file={file} />
								</div>
							</Link>
						))}
					</ul>
				) : (
					<p className="empty-list">No files uploaded</p>
				)}
			</section>
		</div>
	);
}
