import React from 'react'

const Title = ({ title, subtitle, align, font }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center text-center mb-6 md:mb-8 ${
        align === "left" ? "md:items-start md:text-left" : ""
      }`}
    >
      <h1 className={`text-4xl md:text-[48px] ${font || "font-playfair"}`}>
        {title}
      </h1>
      <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
        {subtitle}
      </p>
    </div>
  )
}

export default Title