import { Variants } from "framer-motion";

export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.6,
			ease: "easeOut",
		},
	},
};

export const fadeInUp: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: "easeOut",
		},
	},
};

export const fadeInDown: Variants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: "easeOut",
		},
	},
};

export const slideInLeft: Variants = {
	hidden: { opacity: 0, x: -50 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.6,
			ease: "easeOut",
		},
	},
};

export const slideInRight: Variants = {
	hidden: { opacity: 0, x: 50 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.6,
			ease: "easeOut",
		},
	},
};

export const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.5,
			ease: "easeOut",
		},
	},
};

export const staggerContainer: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

export const staggerItem: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: "easeOut",
		},
	},
};

export const scaleOnHover = {
	rest: { scale: 1 },
	hover: {
		scale: 1.05,
		transition: {
			duration: 0.3,
			ease: "easeInOut",
		},
	},
};

export const glowOnHover = {
	rest: { boxShadow: "0 0 0 rgba(57, 255, 20, 0)" },
	hover: {
		boxShadow: "0 0 20px rgba(57, 255, 20, 0.5)",
		transition: {
			duration: 0.3,
			ease: "easeInOut",
		},
	},
};

export const pageTransition: Variants = {
	initial: { opacity: 0, x: -20 },
	animate: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.4,
			ease: "easeOut",
		},
	},
	exit: {
		opacity: 0,
		x: 20,
		transition: {
			duration: 0.4,
			ease: "easeIn",
		},
	},
};
