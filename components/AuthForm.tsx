"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { montserrat } from "@/app/(auth)/layout";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/user.action";
import OTPModel from "./OTPModel";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
	return z.object({
		email: z.string().email(),
		name:
			formType === "sign-up"
				? z.string().min(2).max(50)
				: z.string().optional(),
	});
};

const AuthForm = ({ type }: { type: FormType }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [accountId, setAccountId] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState("");
	const formSchema = authFormSchema(type);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// why this function call is not come into this line
		// console.log("Data is successfully submitted");
		console.log(values);
		setIsLoading(true);
		setErrorMessage("");
		try {
			const user =
				type === "sign-up"
					? await createAccount({
							name: values.name || "",
							email: values.email,
						})
					: await signInUser({
							email: values.email || "",
						});

			setAccountId(user.accountId);

			if (user?.error) {
				setErrorMessage(user.error);
			}
		} catch {
			setErrorMessage("Failed to create account. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<div className="flex-grow flex items-center justify-center p-3 min-h-[600px] relative">
			<div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
				<div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={`${montserrat.className} auth-form `}
				>
					<h1 className={`form-title`}>
						{type === "sign-in" ? "Sign In" : "Sign Up"}
					</h1>
					<div className=" shadow-lg border border-sky-300 pt-6 shadow-purple-400 flex flex-col gap-5 p-5  rounded-md ">
						{type === "sign-up" && (
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<div className=" flex flex-col gap-y-2">
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your name"
													className="border border-purple-500 border-b-2 border-r-2 outline-none"
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<div className=" flex flex-col gap-2">
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your email"
												className="border border-purple-500 border-b-2 border-r-2 outline-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<Button
							size={"lg"}
							variant={"myButton"}
							className={`${montserrat.className} w-full text-gray-200 `}
							type="submit"
						>
							{type === "sign-in" ? "Sign In" : "Sign Up"}
							{isLoading && (
								<Image
									src="/assets/icons/loader.svg"
									alt="loader"
									width={24}
									height={24}
									className="ml-2 animate-spin"
								/>
							)}
						</Button>
						{errorMessage && (
							<div className="error-message text-rose-500 font-semibold my-[-20px]">
								{errorMessage}
							</div>
						)}
						<div className=" body-2 flex justify-center">
							{type === "sign-in" ? (
								<div>
									Don&apos;t have an account?{" "}
									<Link href="sign-up" className="font-medium underline">
										Sign Up
									</Link>
								</div>
							) : (
								<div>
									Already have an account?{" "}
									<Link href="/sign-in" className="font-medium underline">
										Sign In
									</Link>
								</div>
							)}
						</div>
					</div>
				</form>
			</Form>

			{accountId && (
				<OTPModel
					email={form.getValues("email")}
					setAccountId={setAccountId}
					accountId={accountId}
				/>
			)}
		</div>
	);
};

export default AuthForm;
