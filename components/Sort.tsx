"use client";
import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { usePathname, useRouter } from "next/navigation";
import { sortTypes } from "@/constants";

const Sort = () => {
	const router = useRouter();
	const path = usePathname();
	const handleChange = async (value: string) => {
		router.push(path + "/?sort=" + value);
	};
	return (
		<Select onValueChange={handleChange} defaultValue={sortTypes[0].value}>
			<SelectTrigger className="shad-no-focus h-11 w-full rounded-[8px] border-transparent bg-slate-700 !shadow-sm sm:w-[210px]">
				<SelectValue placeholder={sortTypes[0].label} />
			</SelectTrigger>
			<SelectContent className=" bg-slate-700 text-white ">
				{sortTypes.map((type) => (
					<SelectItem
						className=" cursor-pointer focus:bg-slate-400"
						key={type.value}
						value={type.value}
					>
						{type.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default Sort;
