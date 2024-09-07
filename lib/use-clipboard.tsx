import { useCallback, useState } from "react";

export function useClipboard(timeout = 2000) {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = useCallback(
		(text: string) => {
			if (typeof navigator !== "undefined") {
				navigator.clipboard.writeText(text).then(() => {
					setIsCopied(true);
					setTimeout(() => setIsCopied(false), timeout);
				});
			}
		},
		[timeout],
	);

	return { isCopied, copyToClipboard };
}
