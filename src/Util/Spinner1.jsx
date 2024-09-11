import React from 'react'
import { Blocks } from 'react-loader-spinner'

const Spinner1 = () => {
    return (
        <div style={{ position: 'fixed', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', top: 0, left: 0 }}>
            <Blocks
                visible={true}
                height="80"
                width="80"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
            />
        </div>
    )
}

export default Spinner1
