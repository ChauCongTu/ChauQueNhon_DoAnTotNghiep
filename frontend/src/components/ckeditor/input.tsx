import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from 'react';

interface EditorProps {
    initialValue: string;
    onChange: (data: string) => void;
    hideToolbar?: boolean;
    rows?: number;
    placeholder?: string;
}

const CKEditorInput: React.FC<EditorProps> = ({ initialValue, onChange }) => {
    return (
        <div>
            <CKEditor
                editor={ClassicEditor}
                config={{
                    toolbar: [
                        'heading', '|', 'bold', 'italic', 'underline', '|', 'link', 'imageUpload', 'insertTable', '|', 'codeBlock' // Cấu hình toolbar với các plugin tương ứng
                    ],
                    ckfinder: {
                        uploadUrl: 'http://127.0.0.1:8000/api/v1/upload-image'
                    }
                }}
                data={initialValue}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
            />
        </div>
    );
};

export default CKEditorInput;
