import Card from "@/components/Card";
import { getFiles } from "@/lib/file.action";
import { Models } from "node-appwrite";
import React from "react";

const Image = async ({
	params,
}: {
	params: Promise<{
		pageType: string;
	}>;
}) => {
	const {
		pageType = "" as string,
	}: {
		pageType: string;
	} = await params;

	const files = await getFiles();
	return (
		<div className=" w-full sm:w-[98%] h-[88vh] py-2 overflow-auto remove-scrollbar bg-slate-950 text-gray-100 rounded-3xl">
			<div className=" mx-auto w-full px-4 max-w-7xl flex flex-col items-center gap-8 ">
				<section className=" w-full">
					<h1 className="h1 capitalize">{pageType}</h1>
					<div className=" flex flex-col justify-between mt-2 sm:flex-row sm:items-center sm:gap-2">
						<p className="body-1">
							Total: <span className="h5">0 MB</span>
						</p>

						<div className="mt-5 flex items-center sm:mt-0 sm:gap-3">
							<p className="hidden text-light-200 sm:block">Sort by:</p>

							{/* <Sort /> */}
						</div>
					</div>
				</section>
				{files.total > 0 ? (
					<section className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{files.documents.map((file: Models.Document) => (
							<Card key={file.$id} file={file} />
						))}
					</section>
				) : (
					<p className="empty-list">No files uploaded</p>
				)}
			</div>
		</div>
	);
};

export default Image;
