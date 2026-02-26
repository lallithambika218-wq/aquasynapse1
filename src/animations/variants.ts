import { Variants } from 'framer-motion'

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
}

export const slideIn: Variants = {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
}

export const cardHover = {
    rest: { y: 0, boxShadow: '0 0 0 rgba(0,212,170,0)' },
    hover: { y: -3, boxShadow: '0 8px 32px rgba(0,212,170,0.15)', transition: { duration: 0.25 } },
}

export const sosPulse: Variants = {
    idle: { scale: 1, boxShadow: '0 0 0 0 rgba(239,68,68,0.4)' },
    pulse: {
        scale: [1, 1.05, 1],
        boxShadow: ['0 0 0 0 rgba(239,68,68,0.4)', '0 0 0 12px rgba(239,68,68,0)', '0 0 0 0 rgba(239,68,68,0)'],
        transition: { duration: 1.2, repeat: Infinity },
    },
}

export const numberSpring = { type: 'spring', damping: 20, stiffness: 120 }
