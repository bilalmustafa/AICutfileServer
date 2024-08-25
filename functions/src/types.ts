/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */

export interface DescribeImageRequest {
    publicUrl: string;
}

export interface CreatePromptforExistingImageRequest {
    style: string;
    description: string;
}

export interface CreatePromptforNewImageRequest {
    style: string;
    quote: string;
    description?: string;
}
