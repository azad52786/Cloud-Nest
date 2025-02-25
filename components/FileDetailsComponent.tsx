import { Models } from "node-appwrite";
import React from "react";
import PreviewImage from "./PreviewImage";
import FormattedDateTime from "./FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
export const ImageThumbnail = ({ file }: { file: Models.Document }) => (
	<div className="!mb-1 w-full break-words flex bg-slate-700 items-center  gap-5 rounded-xl p-3 ">
		<PreviewImage
			type={file.type}
			extension={file.extension}
			url={file.url}
			className=" flex-shrink-0"
		/>
		<div className="flex flex-col items-start ">
			<p className=" text-sm md:text-base font-semibold mb-1 break-all overflow-hidden truncate text-ellipsis ">
				{file.name}
			</p>
			<FormattedDateTime date={file.$createdAt} className="sm:font-semibold" />
		</div>
	</div>
);

const TextDetilsAboutFile = ({
	label,
	value,
}: {
	label: string;
	value: string;
}) => (
	<div className="flex">
		<p className="file-details-label text-purple-300 text-left">{label}</p>
		<p className="file-details-value text-sky-300 text-left">{value}</p>
	</div>
);

const FileDetailsComponent = ({ file }: { file: Models.Document }) => {
	return (
		<div className=" text-gray-300">
			<ImageThumbnail file={file} />
			<div className=" flex flex-col mt-3 ">
				<TextDetilsAboutFile label="Format:" value={file.extension} />
				<TextDetilsAboutFile label="Size:" value={convertFileSize(file.size)} />
				<TextDetilsAboutFile label="Owner:" value={file.owner.name} />
				<TextDetilsAboutFile
					label="Last edit:"
					value={formatDateTime(file.$updatedAt)}
				/>
			</div>
		</div>
	);
};

export default FileDetailsComponent;
