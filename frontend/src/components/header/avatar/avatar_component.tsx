import { Image } from 'antd';
import React from 'react'

type Props = {
    src: string|undefined,
    preview?: boolean | null,
    size?: number | null
}

const AvatarComponent: React.FC<Props> = ({ src, preview, size }) => {
    const previewValue = preview ?? false;
    const sizeValue = size ?? 40;
    return (
        <Image src={src} className={`border border-black !w-${sizeValue}xs md:!w-${sizeValue}md !h-${sizeValue}xs md:!h-${sizeValue}md rounded-full object-cover`} preview={previewValue} />
    )
}

export default AvatarComponent