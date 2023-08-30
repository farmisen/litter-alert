import React from "react"

export const ImagePreview = ({ dataUri }: { dataUri: string }) => {
  return (
    <div>
      <img src={dataUri} className="w-32" />
    </div>
  )
}

export default ImagePreview
