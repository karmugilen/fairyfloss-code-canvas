import { useState, useEffect, useRef } from 'react';

export const useBlink = (imagesLoaded: boolean) => {
    const [isBlinking, setIsBlinking] = useState(false);
    const blinkTimeout = useRef<NodeJS.Timeout | null>(null);
    const nextBlinkTimeout = useRef<NodeJS.Timeout | null>(null);
    const isBlinkingRef = useRef(isBlinking);

    useEffect(() => {
        isBlinkingRef.current = isBlinking;
    }, [isBlinking]);

    const triggerBlink = (e?: React.MouseEvent | React.TouchEvent) => {
        // Don't allow blinking until images are loaded
        if (!imagesLoaded) return;

        if (e && e.type === 'touchstart') {
            e.preventDefault();
        }

        if (blinkTimeout.current) {
            clearTimeout(blinkTimeout.current);
            blinkTimeout.current = null;
        }

        if (isBlinkingRef.current) {
            setIsBlinking(true);
            blinkTimeout.current = setTimeout(() => {
                setIsBlinking(false);
            }, 120);
            return;
        }

        setIsBlinking(true);
        blinkTimeout.current = setTimeout(() => {
            setIsBlinking(false);
            blinkTimeout.current = setTimeout(() => {
                setIsBlinking(true);
                blinkTimeout.current = setTimeout(() => {
                    setIsBlinking(false);
                }, 120);
            }, 150);
        }, 120);
    };

    useEffect(() => {
        if (!imagesLoaded) return;

        const initialDelay = setTimeout(() => {
            const doSingleBlink = () => {
                setIsBlinking(true);
                blinkTimeout.current = setTimeout(() => {
                    setIsBlinking(false);
                }, 80);
            };

            const doDoubleBlink = () => {
                setIsBlinking(true);
                blinkTimeout.current = setTimeout(() => {
                    setIsBlinking(false);
                    blinkTimeout.current = setTimeout(() => {
                        setIsBlinking(true);
                        blinkTimeout.current = setTimeout(() => {
                            setIsBlinking(false);
                        }, 80);
                    }, 120);
                }, 80);
            };

            const scheduleBlink = () => {
                const openDuration = 3000 + Math.random() * 2000;
                nextBlinkTimeout.current = setTimeout(() => {
                    if (Math.random() < 0.7) {
                        doDoubleBlink();
                        nextBlinkTimeout.current = setTimeout(scheduleBlink, 280);
                    } else {
                        doSingleBlink();
                        nextBlinkTimeout.current = setTimeout(scheduleBlink, 80);
                    }
                }, openDuration);
            };

            scheduleBlink();
        }, 1200);

        return () => {
            clearTimeout(initialDelay);
            if (blinkTimeout.current) clearTimeout(blinkTimeout.current);
            if (nextBlinkTimeout.current) clearTimeout(nextBlinkTimeout.current);
        };
    }, [imagesLoaded]);

    return { isBlinking, triggerBlink };
};
