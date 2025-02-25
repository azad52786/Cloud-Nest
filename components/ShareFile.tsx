import { ImageThumbnail } from "./FileDetailsComponent";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ShareFileProps } from "@/types";

const ShareFile = ({
	file,
	onInputChange,
	onRemoveEmailAccess,
}: ShareFileProps) => {
	return (
		<>
			<ImageThumbnail file={file} />

			<div className="!mt-2 space-y-2">
				<p className=" text-indigo-300 pl-1 text-light-100">
					Write all the emails you need to share, separated by commas(,)
				</p>
				<Input
					type="email"
					placeholder="Enter email address"
					onChange={(e) =>
						onInputChange(
							e.target.value
								.trim()
								.split(",")
								.map((item) => item.trim())
						)
					}
					className="share-input-field"
				/>
				<div className="pt-4">
					<div className=" text-sky-400 flex justify-between">
						<p className="subtitle-2 text-light-100">Shared with</p>
						<p className="subtitle-2 text-light-200">
							{file.users.length} users
						</p>
					</div>

					<ul className="pt-2">
						{file.users.map((email: string) => (
							<li
								key={email}
								className="flex items-center justify-between gap-2 text-green-400"
							>
								<p className="subtitle-2">{email}</p>
								<Button
									onClick={() => onRemoveEmailAccess(email)}
									className="share-remove-user"
								>
									<Image
										src="/assets/icons/remove.svg"
										alt="Remove"
										width={24}
										height={24}
										className="remove-icon invert-[1] opacity-80"
									/>
								</Button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
};

export default ShareFile;
