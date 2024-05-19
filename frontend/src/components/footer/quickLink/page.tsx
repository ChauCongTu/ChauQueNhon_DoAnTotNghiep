import React, { useEffect, useState } from 'react'

type Props = {}

const QuickLink = (props: Props) => {
    const [show, setShow] = useState(false);
    useEffect(()=> {
        const quickLinks = localStorage.getItem('quicklink');
    }, [])
    return (
        <div>

        </div>
    )
}

export default QuickLink