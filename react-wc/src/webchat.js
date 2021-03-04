import React, { useMemo } from 'react';
import ReactWebChat, { createDirectLine } from 'botframework-webchat';

export default () => {
    const directLine = useMemo(() => createDirectLine({ token: '9p0YrvMl3YY.cwA.AUs.tskCeq0H3R1wzzEkBmQXDhX4_0ToHtjgBK5IqUQk5k0' }), []);

    return <ReactWebChat directLine={directLine} userID="YOUR_USER_ID" />;
};
