import { Image } from 'antd';
import React from 'react'

type Props = {
    src: string|undefined,
    preview?: boolean | null,
    size?: number | null
}

const AvatarComponent: React.FC<Props> = ({ src, preview, size }) => {
    const previewValue = preview ?? false;
    const sizeValue = size ?? 32;
    return (
        <div className={`!w-${sizeValue}xs md:!w-${sizeValue}md !h-${sizeValue}xs md:!h-${sizeValue}md`}>
            <Image src={src} className={`border border-black rounded-full object-cover`} width={'100%'} height={'100%'} preview={previewValue} />
        </div>
    )
}

export default AvatarComponent