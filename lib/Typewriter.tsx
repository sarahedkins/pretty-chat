import { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import React from 'react';

export interface Props {
    isTyping: boolean;
    rawText: string;
    incrementor: number;
    markdownSegments: Array<number | undefined>;
    edgeColor?: string;
    restColor?: string;
    edgeDuration?: number;
}

export const Typewriter = ({
    isTyping,
    rawText,
    incrementor,
    markdownSegments,
    edgeColor = "#ff03ee",
    restColor = "#000",
    edgeDuration = 0.5,
}: Props) => {
    return (
        <>
            <style>
                {`

            .rest {
                color: ${restColor};
            }

            .prettyChatFade {
              display: inline-block;
              color: ${edgeColor};
              background-image: linear-gradient(to right, ${restColor} 98%, ${edgeColor} 98%);
              -webkit-background-clip: text;
              background-clip: text;
              animation: PrettyFade ${edgeDuration}s ease-in-out forwards;
              animation-direction: normal;
            }

            @keyframes PrettyFade {
                0 % {
                        color: ${edgeColor};
                }

                100% {
                    color: ${restColor};
                }
            }

            .inline {
              display: inline-block;
            }
        `}
            </style>

            {!isTyping ? (
                <div>
                    <span className='rest, inline'>
                        <ReactMarkdown>{rawText}</ReactMarkdown>
                    </span>
                </div >
            ) : (
                <div className="rest, inline">
                    {
                        rawText.split("").slice(0, incrementor).map((char, i) => {
                            if (markdownSegments[i] != undefined && markdownSegments[i] != i) {
                                return <Fragment key={i}></Fragment>; // skip until the last one
                            }
                            if (markdownSegments[i] != undefined) {
                                // build the markdown substring and render
                                let markdownBuilder: string[] = [];
                                let p = i;
                                while (markdownSegments[p] === i) {
                                    markdownBuilder.unshift(rawText[p]);
                                    p--;
                                }
                                const markdownSegment = markdownBuilder.join("");
                                return (
                                    <span key={i} className="inline">
                                        <ReactMarkdown
                                            components={{
                                                'p': 'span'
                                            }}
                                        >{markdownSegment}</ReactMarkdown>
                                    </span>
                                );
                            } else {
                                if (char === " ") {
                                    return (<span key={i}>{" "}</span>);
                                }
                                return (
                                    <span
                                        key={`${i}-${char}`}
                                        className={`inline, ${isTyping ? 'prettyChatFade' : ''}`}
                                    >
                                        {char}
                                    </span>
                                );
                            }
                        })
                    }
                </div >
            )}
        </>);
};