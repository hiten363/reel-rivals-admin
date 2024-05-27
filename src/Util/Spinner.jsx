import React from 'react';
import { ColorRing } from 'react-loader-spinner';

const Spinner = () => {
    return (
        <ColorRing
            visible={true}
            height="40"
            width="40"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperclassName="blocks-wrapper"
            colors={['#4c36f5', '#712af5', '#b31af0', '#f01ad0', '#f01a57']}
        />
    );
};

export default Spinner;
