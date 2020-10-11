/* eslint-disable react/prop-types */
import React from 'react';

export const PositiveSpan = (props) => {
    return (
        <span {...props} style={{ backgroundColor: 'green' }}>{props.children}</span>
    );
};

export const NegativeSpan = (props) => {
    return (
        <span {...props} style={{ backgroundColor: 'red' }}>{props.children}</span>
    );
};

export const MixedSpan = (props) => {
    return (
        <span {...props} style={{ backgroundColor: 'yellow' }}>{props.children}</span>
    );
};

export const NeutralSpan = (props) => {
    return (
        <span {...props}>{props.children}</span>
    );
};