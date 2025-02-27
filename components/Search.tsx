"use client";
import React, { useEffect } from "react";
import FormattedDateTime from "./FormattedDateTime";
import PreviewImage from "./PreviewImage";
import { Input } from "./ui/input";
import Image from "next/image";
import { Models } from "node-appwrite";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { getFiles } from "@/lib/file.action";
import { Separator } from "./ui/separator";

const Search = () => {
	const [query, setQuery] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const [results, setResults] = React.useState<Models.Document[]>([]);
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("query");
	console.log(searchQuery);
	const [debouncedQuery] = useDebounce(query, 200);
	const path = usePathname();
	const router = useRouter();

	useEffect(() => {
		(async () => {
			if (debouncedQuery.length === 0) {
				setResults([]);
				setOpen(false);
				router.push(path.replace(searchParams.toString(), ""));
				return;
			}
			const files = await getFiles({ types: [], query: debouncedQuery });
			setResults(files.documents);
			setOpen(true);
		})();
	}, [debouncedQuery]);

	useEffect(() => {
		if (!searchQuery) {
			setQuery("");
		}
	}, [searchQuery]);

	const handleClickItem = (file: Models.Document) => {
		setOpen(false);
		setResults([]);
		router.push(
			`/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`
		);
	};

	return (
		<div className="relative w-full md:max-w-[480px]">
			<div className="flex bg-slate-700 h-[52px] flex-1 items-center gap-3 rounded-full px-4">
				<Image
					src="/assets/icons/search.svg"
					alt="Search"
					width={24}
					height={24}
					className=" invert-[1]"
				/>
				<Input
					value={query}
					placeholder="Search..."
					className=" shad-no-focus text-pink-500 font-semibold  w-full border-none p-0 shadow-none"
					onChange={(e) => setQuery(e.target.value)}
				/>

				{open && (
					<ul className="absolute left-0 top-16 z-50 flex w-full flex-col gap-3 rounded-[20px] text-purple-400 p-4 bg-slate-700 shadow-[0px_0px_10px_indigo]">
						{results.length > 0 ? (
							results.map((file: Models.Document, index) => (
								<>
									<li
										className="flex items-center justify-between"
										key={file.$id}
										onClick={() => handleClickItem(file)}
									>
										<div className="flex cursor-pointer items-center gap-4">
											<PreviewImage
												type={file.type}
												extension={file.extension}
												url={file.url}
												className="size-9 min-w-9"
											/>
											<p className="subtitle-2 line-clamp-1 text-light-100">
												{file.name}
											</p>
										</div>

										<FormattedDateTime
											date={file.$createdAt}
											className="caption text-sky-400 line-clamp-1 "
										/>
									</li>
									{index !== results.length - 1 && (
										<Separator className=" opacity-70" />
									)}
								</>
							))
						) : (
							<p className="empty-result">No files found</p>
						)}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Search;
