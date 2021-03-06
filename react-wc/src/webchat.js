import React, { useMemo, Component } from 'react';
import ReactWebChat, { createDirectLine, createStore} from 'botframework-webchat';
import {hooks} from 'botframework-webchat-component';
export let currentCard;

let {useCreateActivityRenderer, useCreateAttachmentRenderer } = hooks;

const store = createStore({}, ({ dispatch }) => next => action => {
    if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
        dispatch({type: 'WEB_CHAT/SEND_MESSAGE', payload: {text: 'sample:backchannel'}});
    } else if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
        const {activity} = action.payload;

        console.log('store -> ',activity);
    }
    return next(action);
});

export class WebchatRender extends Component{
    state = {
        currentCard: currentCard
    }

    render() {
        return (
            <div>
                <h4>Webchat Renderer</h4>
                {this.state.currentCard}
            </div>
        )
    }
}

export default (props) => {
    const directLine = useMemo(() => createDirectLine({ token: 'nEBUdM8Zvc0.Irr-k3_gn7aR4mm7oWddqFluX__z4Rvars2lb8TRa9U' }), []);
    return (
        <ReactWebChat
            id="webchat"
            directLine={directLine}
            activityMiddleware={activityMiddleware}
            attachmentMiddleware={attachmentMiddleware}
            styleOptions = {styleOptionsConfig}
            adaptiveCardsHostConfig={adaptiveCardsHostConfig}
            userID="YOUR_USER_ID"
        />
        );
};

const attachmentMiddleware = () => next => card => {
    console.log('attachmentMiddleware ->', card);
  return next(card);
};

const activityMiddleware = () => next => (...setupArgs) => {
    const render = next(...setupArgs);
    console.log('activity Render -> ', render, ...setupArgs);
    if(render) {
        return  (...renderArgs) => {
            const element = render(...renderArgs);
            const [card] = setupArgs;
            console.log(element)
            if(element.props.activity.attachments){
                if(element.props.activity.attachments[0].contentType === 'application/vnd.microsoft.card.adaptive'){
                    let attachment = element.props.activity.attachments[0]
                    console.log('attachment -> ', attachment);
                    if(attachment.content.cpi){
                        attachment.content.body[1].style = {
                            color: 'red'
                        };
                        console.log('updated -> ', attachment);
                    }

                }
            }
            return (
                element
            );
    //         const [card] = setupArgs;
    //         console.log('activityMiddleware -> ', card, setStateHandler)
    //         if(card.activity.attachments){
    //             if (card.activity.attachments[0].contentType === 'application/vnd.microsoft.card.adaptive'){
    //                 currentCard = element && <div className={card.activity.from.role === 'user' ? 'highlightedActivity--user' : 'highlightedActivity--bot'}>{element}</div>;
    //                 return currentCard
    //             }
    //             else if (card.activity.attachments[0].contentType === 'application/vnd.microsoft.card.hero'){
    //                 currentCard = element && <div className={card.activity.from.role === 'user' ? 'highlightedActivity--user' : 'highlightedActivity--bot'} style={{'borderColor': 'blue'}}>{element}</div>;
    //                 return currentCard
    //             }
    //             else{
    //                 currentCard = element;
    //                 return element;
    //             }
    //         }
    //         else{
    //             currentCard = element;
    //             return element;
    //         }
        };
    }
    return (render);

};

const styleOptionsConfig = {
    rootWidth: '100%',
    rootHeight: '100%',
    timestampFormat: 'absolute',
    fontSizeSmall: '1.2rem',
    backgroundColor: '#ffffff',
    cardEmphasisBackgroundColor: '#fafafa',
    bubbleBackground: '#EFEFEF',
    bubbleFromUserBackground: 'var(--color-primary)',
    bubbleTextColor: '#555555',
    bubbleFromUserTextColor: '#ffffff',
    bubbleFromUserNubSize: 0,
    bubbleBorderRadius: 8,
    bubbleFromUserBorderRadius: 8,
    bubbleMinHeight: 25,
    sendBoxBackground: '#fff',
    sendBoxTextColor: '#555555',
    botAvatarImage: 'assets/bot-avatar.png',
    botAvatarInitials: null,
    botAvatarBackgroundColor: '#FFFFFF',
};

const adaptiveCardsHostConfig = {
    "hostCapabilities": {
        "capabilities": null
    },
    "choiceSetInputValueSeparator": ",",
    "supportsInteractivity": true,
    "fontTypes": {
        "default": {
            "fontFamily": "'Lato', sans-serif",
            "fontSizes": {
                "small": 12,
                "default": 14,
                "medium": 17,
                "large": 21,
                "extraLarge": 26
            },
            "fontWeights": {
                "lighter": 200,
                "default": 400,
                "bolder": 600
            }
        },
        "monospace": {
            "fontFamily": "'Courier New', Courier, monospace",
            "fontSizes": {
                "small": 12,
                "default": 14,
                "medium": 17,
                "large": 21,
                "extraLarge": 26
            },
            "fontWeights": {
                "lighter": 200,
                "default": 400,
                "bolder": 600
            }
        }
    },
    "spacing": {
        "small": 3,
        "default": 8,
        "medium": 20,
        "large": 30,
        "extraLarge": 40,
        "padding": 10
    },
    "separator": {
        "lineThickness": 1,
        "lineColor": "#EEEEEE"
    },
    "imageSizes": {
        "small": 40,
        "medium": 80,
        "large": 160
    },
    "containerStyles": {
        "default": {
            "foregroundColors": {
                "default": {
                    "default": "#000000",
                    "subtle": "#767676",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                },
                "dark": {
                    "default": "#000000",
                    "subtle": "#66000000",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                },
                "light": {
                    "default": "#FFFFFF",
                    "subtle": "#33000000",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                },
                "accent": {
                    "default": "#E60A79",
                    "subtle": "#E60A79",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                },
                "good": {
                    "default": "#54a254",
                    "subtle": "#DD54a254",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                },
                "warning": {
                    "default": "#c3ab23",
                    "subtle": "#DDc3ab23",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                },
                "attention": {
                    "default": "#FF0000",
                    "subtle": "#DDFF0000",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                }
            },
            "backgroundColor": "#FFFFFF"
        },
        "emphasis": {
            "foregroundColors": {
                "default": {
                    "default": "#000000",
                    "subtle": "#767676",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                },
                "dark": {
                    "default": "#000000",
                    "subtle": "#66000000",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                },
                "light": {
                    "default": "#FFFFFF",
                    "subtle": "#33000000",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                },
                "accent": {
                    "default": "#E60A79",
                    "subtle": "#882E89FC",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                },
                "good": {
                    "default": "#54a254",
                    "subtle": "#DD54a254",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                },
                "warning": {
                    "default": "#c3ab23",
                    "subtle": "#DDc3ab23",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                },
                "attention": {
                    "default": "#FF0000",
                    "subtle": "#DDFF0000",
                    "highlightColors": {
                        "default": "#22000000",
                        "subtle": "#11000000"
                    }
                }
            },
            "backgroundColor": "#F0F0F0"
        }
    },
    "actions": {
        "maxActions": 100,
        "spacing": "Default",
        "buttonSpacing": 8,
        "showCard": {
            "actionMode": "Inline",
            "inlineTopMargin": 8,
            "style": "emphasis"
        },
        "preExpandSingleShowCardAction": false,
        "actionsOrientation": "vertical",
        "actionAlignment": "Stretch",
        "wrap": true
    },
    "adaptiveCard": {
        "allowCustomStyle": false
    },
    "imageSet": {
        "maxImageHeight": 100
    },
    "media": {
        "allowInlinePlayback": true
    },
    "factSet": {
        "title": {
            "size": "Default",
            "color": "Default",
            "isSubtle": false,
            "weight": "Bolder",
            "wrap": true
        },
        "value": {
            "size": "Default",
            "color": "Default",
            "isSubtle": false,
            "weight": "Default",
            "wrap": true
        },
        "spacing": 8
    },
    "cssClassNamePrefix": null,
    "_legacyFontType": {
        "fontFamily": "'Lato', sans-serif",
        "fontSizes": {
            "small": 12,
            "default": 14,
            "medium": 17,
            "large": 21,
            "extraLarge": 26
        },
        "fontWeights": {
            "lighter": 200,
            "default": 400,
            "bolder": 600
        }
    }
};


