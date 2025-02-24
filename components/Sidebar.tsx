"use client";
import { montserrat } from "@/app/(auth)/layout";
import { avatarPlaceholderUrl, navItems } from "@/constants";
import { cn } from "@/lib/utils";
import { userInformation } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = ({ userDetails }: { userDetails: userInformation }) => {
	const pathname = usePathname();
	return (
		<aside
			className={`${montserrat.className} remove-scrollbar hidden h-screen sm:w-[90px] flex-col gap-5 overflow-auto px-5 py-7 sm:flex lg:w-[280px] xl:w-[325px] bg-slate-800`}
		>
			<Image
				src="/assets/icons/logo-full-brand.svg"
				alt="logo"
				width={160}
				height={50}
				className=" h-auto hidden lg:block"
			/>

			<Image
				src="/assets/icons/logo-brand.svg"
				alt="logo"
				width={52}
				height={52}
				className="lg:hidden"
			/>

			<nav
				className=" text-xl font-bold text-white  gap-1 grow-[1] flex-1
 "
			>
				<ul className=" flex flex-1 flex-col gap-3">
					{navItems.map(({ name, url, icon }) => {
						return (
							<Link key={name} href={url} className="lg:w-full">
								<li
									className={cn(
										"flex gap-5 rounded-xl lg:w-full justify-center lg:justify-start items-center lg:px-[30px] h-[54px] lg:rounded-full ",
										pathname === url &&
											"bg-indigo-500 text-white shadow-indigo-500 shadow-md",
										pathname !== url &&
											"hover:shadow-sm hover:shadow-indigo-400"
									)}
								>
									<Image
										src={icon}
										alt={name}
										width={24}
										height={24}
										className={cn(
											" w-6 invert-0 opacity-35",
											pathname === url && " opacity-100"
										)}
									/>
									<p className="hidden lg:block">{name}</p>
								</li>
							</Link>
						);
					})}
				</ul>
			</nav>

			<div className=" w-full flex items-center justify-center">
				<Image
					src="/assets/images/files.png"
					alt="logo"
					width={300}
					height={300}
					className="w-[250px] h-[250px] hidden lg:block"
				/>
			</div>

			<div className="mt-4 flex items-center justify-center gap-2 bg-blue-500 rounded-full  p-1 text-light-100 lg:justify-start lg:p-3">
				<Image
					src={avatarPlaceholderUrl}
					alt="Avatar"
					width={44}
					height={44}
					className=" aspect-square w-10 rounded-full object-cover"
				/>
				<div className="hidden lg:block">
					<p className="text-[16px] leading-[20px] font-semibold capitalize">
						{userDetails?.name}
					</p>
					<p className="text-[14px] leading-[16px] font-normal">
						{userDetails?.email}
					</p>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
