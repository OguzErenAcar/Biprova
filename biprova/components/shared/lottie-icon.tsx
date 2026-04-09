'use client'

import { useRef } from 'react'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'

interface LottieIconProps {
  animationData: object
  size?: number
  className?: string
}

export function LottieIcon({ animationData, size = 48, className }: LottieIconProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  return (
    <div
      style={{ width: size, height: size }}
      className={className}
      onMouseEnter={() => {
        lottieRef.current?.goToAndPlay(0)
      }}
      onMouseLeave={() => {
        lottieRef.current?.goToAndStop(0)
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={false}
        autoplay={false}
      />
    </div>
  )
}
