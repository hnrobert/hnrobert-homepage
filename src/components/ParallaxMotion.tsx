'use client';

import React, { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxMotionProps {
    children: ReactNode;
    translateY?: [number, number];
    translateX?: [number, number];
    opacity?: [number, number];
    speed?: number;
    easing?: number[] | ((t: number) => number);
    className?: string;
    style?: React.CSSProperties;
}

export const ParallaxMotion: React.FC<ParallaxMotionProps> = ({
    children,
    translateY,
    translateX,
    opacity = [0.9, 1],
    speed = 1,
    easing,
    className = '',
    style = {},
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    // 如果提供了自定义 easing，创建缓动函数
    const createEasingFunction = (easingArray: number[]) => {
        // 将 [x1, y1, x2, y2] 转换为 cubic-bezier 函数
        return (t: number) => {
            // 简化版本：使用线性插值
            // 在实际使用中，可以使用更复杂的贝塞尔曲线计算
            const [x1, y1, x2, y2] = easingArray;
            // 简单的三次贝塞尔曲线近似
            const t2 = t * t;
            const t3 = t2 * t;
            const mt = 1 - t;
            const mt2 = mt * mt;
            const mt3 = mt2 * mt;
            return 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3;
        };
    };

    // 使用 spring 配置
    const springConfig = {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    };

    // 如果有 easing，先应用 easing 曲线，然后再应用弹簧效果
    // 这样可以结合两者的优点：自定义缓动 + 平滑的弹簧特性
    let progress;
    if (easing && Array.isArray(easing)) {
        const easedProgress = useTransform(scrollYProgress, createEasingFunction(easing));
        progress = useSpring(easedProgress, springConfig);
    } else {
        progress = useSpring(scrollYProgress, springConfig);
    }

    // 应用变换
    const y = translateY
        ? useTransform(
            progress,
            [0, 1],
            [translateY[0] * speed, translateY[1] * speed]
        )
        : undefined;

    const x = translateX
        ? useTransform(
            progress,
            [0, 1],
            [translateX[0] * speed, translateX[1] * speed]
        )
        : undefined;

    const opacityValue = useTransform(progress, [0, 1], opacity);

    return (
        <div ref={ref} className={className} style={style}>
            <motion.div
                style={{
                    y,
                    x,
                    opacity: opacityValue,
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};
