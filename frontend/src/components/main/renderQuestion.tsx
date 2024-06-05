import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

type Props = {
    content: string;
};

const renderMath = (htmlString: string): string => {
    const regexInline = /\\\((.*?)\\\)/g;
    const regexDisplay = /\\\[(.*?)\\\]/g;

    const replaceMath = (match: string, p1: string, isInline: boolean) => {
        try {
            return katex.renderToString(p1, {
                throwOnError: false,
                displayMode: !isInline,
            });
        } catch (error) {
            console.error(error);
            return match;
        }
    };

    const processedContent = htmlString
        .replace(regexInline, (match, p1) => replaceMath(match, p1, true))
        .replace(regexDisplay, (match, p1) => replaceMath(match, p1, false));

    return processedContent;
};

const RenderContent: React.FC<Props> = ({ content }) => {
    const processedContent = renderMath(content);
    return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
};

export default RenderContent;
