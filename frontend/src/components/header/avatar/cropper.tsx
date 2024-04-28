import React, { useState, useRef } from "react";
import { Modal, Slider, Button, Image } from "antd";
import AvatarEditor from "react-avatar-editor";

interface CropperModalProps {
    src: string | null;
    modalOpen: boolean;
    setModalOpen: (isOpen: boolean) => void;
    setPreview: (preview: string) => void;
    setImageFile: (imageFile: File) => void;
}

const CropperModal: React.FC<CropperModalProps> = ({
    src,
    modalOpen,
    setModalOpen,
    setPreview,
    setImageFile
}) => {
    const [slideValue, setSlideValue] = useState<number>(10);
    const cropRef: any = useRef(null);

    //handle save
    const handleSave = async () => {
        if (cropRef.current) {
            const dataUrl = cropRef.current.getImage().toDataURL();
            const result = await fetch(dataUrl);
            const blob = await result.blob();
            const croppedFile = new File([blob], 'cropped_image.png', { type: 'image/png' });
            setImageFile(croppedFile);
            setPreview(URL.createObjectURL(blob));
            setModalOpen(false);
        }
    };

    return (
        <Modal centered open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
            <div className="">
                <AvatarEditor
                    ref={cropRef}
                    image={src || ""}
                    style={{ width: "100%", height: "100%" }}
                    border={50}
                    borderRadius={150}
                    color={[0, 0, 0, 0.72]}
                    scale={slideValue / 10}
                    rotate={0}
                />

                <Slider
                    min={10}
                    max={50}
                    className="!text-primary"
                    defaultValue={slideValue}
                    value={slideValue}
                    onChange={(value) => setSlideValue(value)}
                />
                <div className="flex gap-7xs md:gap-7md">
                    <Button className="" onClick={() => setModalOpen(false)}>
                        Hủy
                    </Button>
                    <Button className="bg-primary text-white" onClick={handleSave}>
                        Xác nhận
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const Cropper: React.FC<{ setImageFile: (imageFile: File) => void }> = ({ setImageFile }) => {
    const [src, setSrc] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleInputClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (inputRef.current) inputRef.current.click();
    };
    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSrc(URL.createObjectURL(e.target.files[0]));
            setModalOpen(true);
        }
    };

    return (
        <>
            <>
                <CropperModal
                    modalOpen={modalOpen}
                    src={src}
                    setPreview={setPreview}
                    setModalOpen={setModalOpen}
                    setImageFile={setImageFile}
                />
                <div className="flex justify-center mt-10xs md:mt-10md">
                    <Button onClick={handleInputClick} className="bg-primary text-white px-15xs md:px-15md rounded hover:bg-slate-500 py-5xs md:py-5md cursor-pointer">
                        {
                            preview ? 'Tải ảnh khác' : 'Tải lên ảnh'
                        }
                    </Button>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleImgChange}
                    style={{ display: "none" }}
                />
                {
                    preview && <div className="img-container mt-10xs md:mt-10md text-center">
                        <Image src={preview} alt="" width={200} height={200} className="border" />
                        <p>{preview}</p>
                    </div>
                }

            </>
        </>
    );
};

export default Cropper;
