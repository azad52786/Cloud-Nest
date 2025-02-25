import { getCurrentLoginUser } from "@/lib/user.action";

import MobileNavbar from "@/components/MobileNavbar";
import Sidebar from "@/components/Sidebar";
import { montserrat } from "../(auth)/layout";

const layout = async ({ children }: { children: React.ReactNode }) => {
	const currentUser = await getCurrentLoginUser();
	console.log(currentUser);

	return (
		<main
			className={` flex bg-slate-800 w-full min-h-screen ${montserrat.className}`}
		>
			<Sidebar userDetails={currentUser}></Sidebar>
			<section className="bg-slate-800 flex grow-[1] h-full flex-col">
				<MobileNavbar userDetails={currentUser} />
				Header
				<div>{children}</div>
			</section>
		</main>
	);
};
export default layout;
