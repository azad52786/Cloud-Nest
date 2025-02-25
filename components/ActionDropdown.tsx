"use client";
import { Models } from "node-appwrite";
import React, { useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { ActionType } from "@/types";
import { actionsDropdownItems } from "@/lib/utils";
import Link from "next/link";
import { constructDownloadUrl } from "@/constants";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);
	const [action, setAction] = useState<ActionType | null>(null);
	const [name, setName] = useState(file.name);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handelAllCloseModal = () => {
		setIsDropDownOpen(false);
		setIsDropDownOpen(false);
		setAction(null);
		setName(file.name);
	};

	const handleAction = () => {};

	const renderModal = () => {
		if (!action) return null;
		const { label, value } = action;

		return (
			<DialogContent className="rounded-[26px] w-[90%] max-w-[400px] px-6 py-8 button border border-sky-300 bg-slate-950  text-slate-100">
				<DialogHeader className="flex flex-col gap-3">
					<DialogTitle className="text-center text-indigo-500">
						{label}
					</DialogTitle>
					{value === "rename" && (
						<Input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className=" border-r border-b-2 border-r-purple-400 border-b-purple-400 !outline-none bg-slate-800"
						/>
					)}
				</DialogHeader>
				{["rename", "delete", "share"].includes(value) && (
					<DialogFooter className="flex flex-col gap-3 md:flex-row transition-all duration-300 ">
						<Button
							onClick={handelAllCloseModal}
							className="h-[52px] flex-1 rounded-full bg-indigo-600  hover:bg-indigo-700 "
						>
							Cancel
						</Button>
						<Button
							onClick={handleAction}
							className=" rounded-full bg-green-400 text-gray-900 !mx-0 h-[52px] w-full flex-1 hover:bg-green-500"
						>
							<p className="capitalize">{value}</p>
							{isLoading && (
								<Image
									src="/assets/icons/loader.svg"
									alt="loader"
									width={24}
									height={24}
									className="animate-spin"
								/>
							)}
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		);
	};
	return (
		<Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
			<DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
				<DropdownMenuTrigger className=" shad-no-focus ">
					<Image
						src="/assets/icons/dots.svg"
						alt="dots"
						width={34}
						height={34}
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent className=" bg-slate-900 text-gray-200 border-none shadow-[0px_0px_7px_#0ea5e9]">
					<DropdownMenuLabel className="max-w-[200px] text-lg truncate">
						{file.name}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{actionsDropdownItems.map((action) => {
						return (
							<DropdownMenuItem
								key={action.label}
								onClick={() => {
									setAction(action);
									if (
										["rename", "share", "delete", "details"].includes(
											action.value
										)
									) {
										setIsOpenModal(true);
									}
								}}
								className="flex capitalize text-lg font-bold hover:bg-slate-700 cursor-pointer"
							>
								{action.value === "download" ? (
									<Link
										href={constructDownloadUrl(file.bucketFileId)}
										className=" flex w-full items-center  gap-4 capitalize"
									>
										<Image
											src={action.icon}
											alt={action.label}
											width={24}
											height={24}
											className=" size-10"
										/>
										<p>{action.value}</p>
									</Link>
								) : (
									<div className=" flex w-full items-center  gap-4">
										<Image
											src={action.icon}
											alt={action.label}
											width={24}
											className=" size-10"
											height={24}
										/>
										<p>{action.value}</p>
									</div>
								)}
							</DropdownMenuItem>
						);
					})}
				</DropdownMenuContent>
			</DropdownMenu>
			{renderModal()}
		</Dialog>
	);
};

export default ActionDropdown;
