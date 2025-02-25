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
import { actionsDropdownItems, cn } from "@/lib/utils";
import Link from "next/link";
import { constructDownloadUrl } from "@/constants";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { deleteFile, renameFile, updateUsersAccess } from "@/lib/file.action";
import { usePathname } from "next/navigation";
import FileDetailsComponent from "./FileDetailsComponent";
import ShareFile from "./ShareFile";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);
	const [action, setAction] = useState<ActionType | null>(null);
	const [name, setName] = useState(file.name);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [emails, setEmails] = useState<string[]>([]);
	const path = usePathname();
	const handelAllCloseModal = () => {
		setIsDropDownOpen(false);
		setIsDropDownOpen(false);
		setAction(null);
		setName(file.name);
		setEmails([]);
	};
	console.log(file.bucketFileId);

	const handleRemoveEmailAccess = (email: string) => {
		const updatedEmailAccess = file.users.filter((e: string) => e !== email);

		updateUsersAccess({
			fileId: file.$id,
			emails: updatedEmailAccess,
			path,
		});
	};

	const handleAction = async () => {
		if (!action) return;
		setIsLoading(true);

		const actions = {
			rename: () =>
				renameFile({ fileId: file.$id, name, extension: file.extension, path }),
			share: () =>
				updateUsersAccess({
					fileId: file.$id,
					emails: [...emails, ...file.users],
					path,
				}),
			delete: () =>
				deleteFile({ fileId: file.$id, bucketId: file.bucketFileId, path }),
		};

		let isSuccess = false;

		isSuccess = await actions[action.value as keyof typeof actions]();

		if (isSuccess) {
			handelAllCloseModal();
		}

		setIsLoading(false);
	};

	const renderModal = () => {
		if (!action) return null;
		const { label, value } = action;

		return (
			<DialogContent className="rounded-[26px] w-[95%] max-w-[500px] sm:px-6 px-1 py-8  button border border-sky-300 bg-slate-950  text-slate-100">
				<DialogHeader className="flex w-full overflow-hidden flex-col gap-3">
					<DialogTitle className="text-center text-indigo-500">
						{label}
					</DialogTitle>
					{value === "rename" && (
						<Input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className=" border-r border-b-2 border-r-purple-400 h-10 !text-lg border-b-purple-400 !outline-none bg-slate-800"
						/>
					)}
					{value === "details" && <FileDetailsComponent file={file} />}
					{value === "share" && (
						<ShareFile
							file={file}
							onInputChange={setEmails}
							onRemoveEmailAccess={handleRemoveEmailAccess}
						/>
					)}
					{value === "delete" && (
						<p className="delete-confirmation">
							Are you sure you want to delete{` `}
							<span className="delete-file-name">{file.name}</span>?
						</p>
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
							className={cn(
								" rounded-full bg-green-400 text-gray-900 !mx-0 h-[52px] w-full flex-1 hover:bg-green-500",
								action.value === "delete" && "bg-rose-600 hover:bg-rose-700"
							)}
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
