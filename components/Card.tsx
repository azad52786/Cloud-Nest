import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";
import PreviewImage from "./PreviewImage";
import ActionDropdown from "./ActionDropdown";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";

const Card = ({ file }: { file: Models.Document }) => {
	return (
		<Link
			href={file.url}
			target="_blank"
			className="  flex transition-all duration-300 cursor-pointer flex-col gap-4 rounded-[18px] bg-slate-800 p-3 shadow-sm border border-sky-400"
		>
			<div className="flex justify-between">
				<PreviewImage
					type={file.type}
					extension={file.extension}
					url={file.url}
					className="!size-20 !bg-gray-700 !rounded-full"
					imageClassName="!size-14 !rounded-full"
				/>

				<div className="flex flex-col items-end justify-between">
					<ActionDropdown file={file} />
					<p className="body-1">{convertFileSize(file.size)}</p>
				</div>
			</div>

			<div className="flex flex-col gap-2 break-words">
				<p className=" font-bold text-sm">{file.name.slice(0, 120)}</p>
				<FormattedDateTime
					date={file.$createdAt}
					className=" font-semibold text-sm "
				/>
				<p className=" font-normal text-sm">By: {file.owner.name}</p>
			</div>
		</Link>
	);
};

export default Card;
