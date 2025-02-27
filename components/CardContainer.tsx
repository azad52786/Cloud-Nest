import React from "react";
import { getFiles } from "@/lib/file.action";
import { FileType } from "@/lib/utils";
import Card from "./Card";
import { Models } from "node-appwrite";
const CardContainer = async ({
	searchParams,
	types,
}: {
	searchParams: Promise<{ query: string; sort: string }>;
	types: FileType[];
}) => {
	const { query = "" as string, sort = "" as string } = await searchParams;
	const files = await getFiles({ types, query, sort });
	return files.total > 0 ? (
		<section className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{files.documents.map((file: Models.Document) => (
				<Card key={file.$id} file={file} />
			))}
		</section>
	) : (
		<p className="empty-list">No files uploaded</p>
	);
};

export default CardContainer;
