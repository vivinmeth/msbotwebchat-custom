import React, { useMemo, Component } from 'react';
import ReactWebChat, { createDirectLine, createStore, hooks} from 'botframework-webchat';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import {Components} from 'botframework-webchat-component';
import like from './assets/img/emojis/like-100px.gif';
import devil from './assets/img/emojis/devil-100px.gif';
import grinning from './assets/img/emojis/grinning-100px.gif';
import hi from './assets/img/emojis/hi-40px.gif';
import monkey from './assets/img/emojis/monkey-100px.gif';
import sad from './assets/img/emojis/sad-100px.gif';
import smile from './assets/img/emojis/smile-special.gif';
import tongue_out from './assets/img/emojis/tongue-out-100px.gif';


import PlainWebChat from './PlainWebChat';

import * as AdaptiveCards from 'adaptivecards';

window.CPI = {
    RENDERER_ENABLED: true,
    EMOJI_RENDERER: false,
    CPI_SHOW_OFF: false,
}

export let currentCard;

let {useCreateActivityRenderer, useRenderAttachment, useAdaptiveCardsPackage } = hooks;


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
            userID="vivinmeth@emplay.vivinmeth.com"
        />
        // <React.Fragment>
        //     <h1>Web Chat with plain UI</h1>
        //     <hr />
        //     {!!directLine && (
        //         <Components.Composer directLine={directLine}>
        //             <PlainWebChat />
        //         </Components.Composer>
        //     )}
        // </React.Fragment>
        );
};

const attachmentMiddleware = () => next => card => {
    console.log('attachmentMiddleware ->', card);
    if (!window.CPI.RENDERER_ENABLED || !window.CPI.EMOJI_RENDERER){
        return (next(card))
    }
    if(card.attachment.contentType === 'application/vnd.microsoft.card.adaptive'){
        if(card.attachment.content.cpi){
            // card.attachment.content.body[1].style = {
            //     color:'red'
            // }

            const cpiConfig = card.attachment.content.cpi;
            if(cpiConfig.enabled){
                let cardRender;
                if(cpiConfig.cardType === 'emoji'){
                    cardRender = emojiCard(getEmoji(card.attachment.content.emoji));
                    if (cardRender){
                        return (
                            <div>
                                {cardRender}
                            </div>
                        )
                    }
                }



            }


        }




    }
    else if(card.attachment.contentType === 'text/markdown' || card.attachment.contentType === 'text/plain'){
        let emoji = emojiCard(getEmoji(card.attachment.content));
        if(!emoji){

            const emoji = renderEmoji(card.attachment.content);
            console.log('text render, emoji ->', emoji);
            if (emoji){
                return (
                    <div style={{'padding': '5px'}}>
                        <p>CPI Emoji Render!</p>
                        <hr/>
                        <div style={{
                            display: 'flex',
                            'alignItems': 'center',
                            'flex-wrap': 'wrap',
                            // 'gridAutoFlow': 'column',
                            'grid-template-columns': 'repeat(auto-fit, minmax(max-content, 225px))',
                            'grid-template-rows': 'repeat(auto-fit, minmax(27px, max-content))',
                            // grid-auto-flow: column;
                        }}>
                            {emoji}
                        </div>

                    </div>
                )
            }
        } else{
            return (
                <div style={{'padding': '5px'}}>
                    <p>CPI Emoji Render!</p>
                    <hr/>
                    <div style={{
                        display: 'flex',
                        'alignItems': 'center',
                        'flex-wrap': 'wrap',
                        // 'gridAutoFlow': 'column',
                        'grid-template-columns': 'repeat(auto-fit, minmax(max-content, 225px))',
                        'grid-template-rows': 'repeat(auto-fit, minmax(27px, max-content))',

                    }}>
                        {emoji}
                    </div>

                </div>
            )
        }
    }
  return next(card);
};

const renderEmoji = (textBlock) => {
    let possibleCMDs = stringPatterns(textBlock, /\(+[a-z]+\)/);
    if (possibleCMDs.length === 0){
        return null;
    }
    else{
        console.log('============ render emoji start ============');
        let finalText = [];
        for (const cmd of possibleCMDs){
            if(possibleCMDs.indexOf(cmd) === 0){
                let text = textBlock.slice(0, cmd[1][0]);
                text.split(' ').map( text => {
                    finalText.push(text);
                });
            }
            else{
                let text = textBlock.slice(possibleCMDs[possibleCMDs.indexOf(cmd) - 1][1][1], cmd[1][0]);
                text.split(' ').map( text => {
                    finalText.push(text);
                });
                // finalText.push(textBlock.slice(possibleCMDs[possibleCMDs.indexOf(cmd) - 1][1][1], cmd[1][0]));
            }
            finalText.push(cmd[0]);
            if(possibleCMDs.indexOf(cmd) === (possibleCMDs.length -1)){
                if(cmd[1][1] < textBlock.length){
                    let text = textBlock.slice(cmd[1][1], textBlock.length);
                    text.split(' ').map( text => {
                        finalText.push(text);
                    });
                    // finalText.push(textBlock.slice(cmd[1][1], textBlock.length));
                }
            }
            console.log('emoji cmd', cmd[0], cmd[1], textBlock.slice(cmd[1][0], cmd[1][1]), textBlock);
        }
        console.log('============ render emoji done ============');

        console.log('finalText', finalText);
        let finalRender = (

                finalText.map((text, index) => {
                    const emoji = emojiCard(getEmoji(text), '25px');
                    console.log('emoji is ->', emoji);
                    if (emoji){
                        return (<span key={index} style={{'width': 'fit-content', 'white-space': 'nowrap'}}>{emoji}</span>);
                    }
                    return (<span key={index} style={{'width': 'fit-content', 'white-space': 'nowrap'}}>&nbsp;{text}&nbsp;</span>);
                })

        )
        console.log(finalRender);
        console.log('============ final render emoji done ============');
        return finalRender;
    };
};

const stringPatterns = (textBlock, regEx) => {
  let match, indexes= [];
  let text = textBlock;
  let i = 0;
  do {
      i = (indexes.length - 1);
      match= regEx.exec(text);
      if(match){
          console.log(indexes, i , indexes[i])
          const correction = indexes[i]? indexes[i][1][0] + 1 : 0;
          indexes.push([`${match[0]}`, [match.index+correction, match.index+match[0].length+correction]]);
          text = text.substring(text.indexOf(match[0]) + 1);
          console.log(match, indexes, text);
      }

  }while(match);
  console.log('indexes -> ',indexes);
  return indexes;
};

const emojiCard = (emojiResponse, size='60px') => {
    let emojiRender;
    if(emojiResponse.isEmoji){
        emojiRender = (
            <div style={{'width': size, 'height': size, 'backgroundColor': 'white'}}>
                <img src={emojiResponse.emoji} alt={emojiResponse.cmd} style={{'width': '100%', 'height': '100%'}}></img>
            </div>
        )
    }
    else {
        emojiRender = null;
    }
    return emojiRender;
};

const getEmoji = (cmd) => {
    const commandEmojiMap = {
        '(like)': like,
        '(hi)': hi,
        '(devil)': devil,
        '(xd)': grinning,
        '(monkey)': monkey,
        '(sad)': sad,
        '(smile)': smile,
        '(tongueout)': tongue_out
    }
    return ( {
        isEmoji: !!commandEmojiMap[cmd],
        cmd,
        emoji: commandEmojiMap[cmd]
    });
}

const acSubmitButtonDisabler = (event) => {
    event.persist();
    const buttons = event.currentTarget.querySelectorAll('button');
    console.log('acSubmitButtonDisabler -> ',event, event.target, typeof event.target, event.currentTarget, event.currentTarget.querySelectorAll('button'));
    for (const button of buttons){
        console.log(button, 'event adding!');
        button.addEventListener('click', (event) => {
            // event.persist();
            // event.preventDefault();
            console.log('buttonClicked? -> ', event)

            //event.currentTarget.disabled = true;
            event.currentTarget.style.display = "none";
            event.currentTarget.style.opacity = 0.4;
            event.currentTarget.style.borderColor = "black";
            event.currentTarget.style.color = "black";
            event.currentTarget.style.pointerEvent = "none";

        });
    }

}




const activityMiddleware = () => next => (...setupArgs) => {
    const render = next(...setupArgs);
    console.log('activity Render -> ', render, ...setupArgs);
    if (!window.CPI.RENDERER_ENABLED){
        return (render)
    }
    if(render) {
        return  (...renderArgs) => {
            const element = render(...renderArgs);
            const [card] = setupArgs;
            console.log(element)
            if(element.props.activity.attachments){
                if(element.props.activity.attachments[0].contentType === 'application/vnd.microsoft.card.adaptive'){
                    let attachment = element.props.activity.attachments[0]
                    console.log('attachment -> ', attachment);
                    // if(!attachment.content.cpi){
                    //     if (attachment.content.body.length > 0){
                    //         attachment.content.body[1].style = {
                    //             color: 'red'
                    //         };
                    //         console.log('updated -> ', attachment);
                    //     }
                    //
                    // }
                    const randId = Math.random().toString()
                    return (
                        <div
                            className={card.activity.from.role === 'user' ? 'highlightedActivity--user' : 'highlightedActivity--bot'}
                            onClick={acSubmitButtonDisabler}
                            id={randId}
                        >
                            {
                                window.CPI.CPI_SHOW_OFF ? (<p> CPI Render!</p>) : null
                            }
                            {element}
                            {
                                // setTimeout(() => {
                                //     const elem = document.getElementById(randId)
                                //     console.log(randId, elem);
                                //     if (elem){
                                //
                                //         elem.style.backgroundColor = "grey";
                                //     }
                                // }, 15)
                            }
                        </div>
                    )

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


