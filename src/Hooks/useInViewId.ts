import { useEffect, useState } from "react";

const useInViewId = (ids: string[]) => {
	const [inViewId, setInViewId] = useState<string | null>(null);

	useEffect(() => {
		const threshold = 0.8;
		const handleScroll = () => {
			// Iterate through the elements and check their positions
			for (let i = 0; i < ids.length; i++) {
				const element = document.getElementById(ids[i]);
				if (element) {
					const rect = element.getBoundingClientRect();
					if (rect.top <= window.innerHeight * threshold && rect.bottom >= window.innerHeight * threshold) {
						setInViewId(ids[i]);
						return;
					}
				}
			}
		};

		// Attach the scroll event listener
		window.addEventListener("scroll", handleScroll);

		// Initial check on component mount
		handleScroll();

		return () => {
			// Cleanup: Remove the scroll event listener when the component unmounts
			window.removeEventListener("scroll", handleScroll);
		};
	}, [ids]);

	return inViewId;
};

export default useInViewId;
