import CardContainer from "@/components/CardContainer";
import Loading from "@/components/Loading";
import Sort from "@/components/Sort";

import { FileType, getFileTypesParams } from "@/lib/utils";
import React from "react";
import { Suspense } from "react";
interface Props {
	searchParams: Promise<{ query: string; sort: string }>;
	params: Promise<{ pageType: string }>;
}

const Image = async ({ searchParams, params }: Props) => {
	const { pageType = "" as string } = await params;

	const types = getFileTypesParams(pageType) as FileType[];

	return (
		<div className=" w-full  text-gray-100 rounded-3xl">
			<div className=" mx-auto w-full pb-3 px-4 max-w-7xl flex flex-col items-center gap-8 ">
				<section className=" w-full">
					<h1 className="h1 capitalize">{pageType}</h1>
					<div className=" flex flex-col justify-between mt-2 sm:flex-row sm:items-center sm:gap-2">
						<p className="body-1">
							Total: <span className="h5">0 MB</span>
						</p>

						<div className="mt-5 flex items-center sm:mt-0 sm:gap-3">
							<p className="hidden text-light-200 sm:block">Sort by:</p>

							<Sort />
						</div>
					</div>
				</section>
				<Suspense fallback={<Loading />}>
					<CardContainer searchParams={searchParams} types={types} />
				</Suspense>
			</div>
		</div>
	);
};

export default Image;
