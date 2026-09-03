"use client"

import { type ReactNode } from "react"
import { motion, type Variants } from "motion/react"

import { cn } from "@/lib/utils"

export type BlurRevealProps = {
  children: ReactNode
  className?: string
  /** Seconds before the first child animates. */
  delay?: number
  /** Seconds between siblings. */
  stagger?: number
  /** px travelled on the y axis. */
  distance?: number
  once?: boolean
}

const container = (delay: number, stagger: number): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
})

const child = (distance: number): Variants => ({
  hidden: { opacity: 0, y: distance, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
})

/**
 * Un-blurs and lifts each direct child in sequence when the group scrolls into
 * view. Wrap any element list; nothing about the children needs to change.
 */
export function BlurReveal({
  children,
  className,
  delay = 0,
  stagger = 0.12,
  distance = 16,
  once = true,
}: BlurRevealProps) {
  const childVariants = child(distance)

  return (
    <motion.div
      className={className}
      variants={container(delay, stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
    >
      {Array.isArray(children)
        ? children.map((node, i) => (
            <motion.div key={i} variants={childVariants} className={cn("will-change-transform")}>
              {node}
            </motion.div>
          ))
        : <motion.div variants={childVariants}>{children}</motion.div>}
    </motion.div>
  )
}
