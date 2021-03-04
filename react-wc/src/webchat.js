import React, { useMemo } from 'react';
import ReactWebChat, { createDirectLine } from 'botframework-webchat';

export default () => {
    const directLine = useMemo(() => createDirectLine({ token: 'hqtY50W24oc.Fzxbzd_tZn8Nk67-CxCbPnZEipG4YgO1j9_pPuJKSvQ' }), []);

    return <ReactWebChat directLine={directLine} userID="YOUR_USER_ID" />;
};
