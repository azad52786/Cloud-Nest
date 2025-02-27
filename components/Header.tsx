import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/user.action";
import Search from "./Search";

const Header = ({
	userId,
	accountId,
}: {
	userId: string;
	accountId: string;
}) => {
	return (
		<header className=" flex items-center justify-between gap-5 p-5 sm:flex lg:py-7 xl:gap-10">
			<Search />
			<div className="sm:flex hidden  items-center justify-center min-w-fit gap-4">
				<FileUploader ownerId={userId} accountId={accountId} />
				<form
					action={async () => {
						"use server";

						await signOutUser();
					}}
				>
					<Button
						type="submit"
						className="flex-center h-[52px] min-w-[54px] bg-slate-900 items-center rounded-full  p-0  shadow-none transition-all"
					>
						<Image
							src="/assets/icons/logout.svg"
							alt="logo"
							width={24}
							height={24}
							className="w-6 invert-[1]"
						/>
					</Button>
				</form>
			</div>
		</header>
	);
};

export default Header;
