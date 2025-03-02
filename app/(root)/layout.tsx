import { getCurrentLoginUser } from "@/lib/user.action";

import MobileNavbar from "@/components/MobileNavbar";
import Sidebar from "@/components/Sidebar";
import { montserrat } from "../(auth)/layout";
import Header from "@/components/Header";

const layout = async ({ children }: { children: React.ReactNode }) => {
	const currentUser = await getCurrentLoginUser();

	return (
		<main
			className={` flex bg-slate-800 w-full min-h-screen ${montserrat.className}`}
		>
			<Sidebar userDetails={currentUser}></Sidebar>
			<section className="bg-slate-800 h-screen flex grow flex-col pb-6 sm:pr-6">
				<MobileNavbar userDetails={currentUser} />
				<Header userId={currentUser.$id} accountId={currentUser.accountId} />
				<div className="grow pb-2 bg-slate-950 rounded-3xl  overflow-auto remove-scrollbar">
					{children}
				</div>
			</section>
		</main>
	);
};
export default layout;
