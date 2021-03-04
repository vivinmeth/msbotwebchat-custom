import React, { useMemo } from 'react';
import ReactWebChat, { createDirectLine } from 'botframework-webchat';

export default () => {
    const directLine = useMemo(() => createDirectLine({ token: '' }), []);

    return <ReactWebChat directLine={directLine} userID="YOUR_USER_ID" />;
};
