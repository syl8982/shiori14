import { useEffect, useRef } from 'react'
import { usePickleMotion } from './PickleMotionProvider'

function PickleGraphic({
  id,
  className,
  src,
  enterDelay,
  entryOffset,
  maxPush,
  influenceRadius,
  pushStrength,
  mass,
  spring,
  damping,
  floatDuration = 4.5,
  floatDelay = 0,
  floatAmplitude = 12,
}) {
  const innerRef = useRef(null)
  const { register } = usePickleMotion()

  useEffect(
    () => register(id, innerRef, {
      enterDelay,
      entryOffset,
      maxPush,
      influenceRadius,
      pushStrength,
      mass,
      spring,
      damping,
    }),
    [
      id,
      register,
      enterDelay,
      entryOffset,
      maxPush,
      influenceRadius,
      pushStrength,
      mass,
      spring,
      damping,
    ],
  )

  return (
    <div className={className} aria-hidden="true">
      <div
        className="home__pickle-float"
        style={{
          '--pickle-float-duration': `${floatDuration}s`,
          '--pickle-float-delay': `${floatDelay}s`,
          '--pickle-float-amp': `${floatAmplitude}px`,
        }}
      >
        <img
          ref={innerRef}
          className="home__pickle-motion"
          src={src}
          alt=""
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export default PickleGraphic
