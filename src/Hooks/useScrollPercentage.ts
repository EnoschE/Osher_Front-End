import { useState, useEffect } from "react";

const useScrollPercentage = () => {
	const [scrollPercentage, setScrollPercentage] = useState(0);

	const updateScrollPercentage = () => {
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;
		const scrollTop = window.scrollY;

		const percentage = (scrollTop / (documentHeight - windowHeight)) * 100;

		setScrollPercentage(percentage);
	};

	useEffect(() => {
		window.addEventListener("scroll", updateScrollPercentage);
		return () => {
			window.removeEventListener("scroll", updateScrollPercentage);
		};
	}, []);

	return scrollPercentage;
};

export default useScrollPercentage;
