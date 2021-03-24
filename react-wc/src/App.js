import React, {Component} from 'react';
import './App.css';
import Webchat, {WebchatRender} from "./webchat";

let chat;
let msg;


class App extends Component{

    constructor() {
        super();
        this.state = {
            CPI: {...window.CPI}
        }

        window.APP_STATE = {
            thisArg: this,
            state: this.state,
            setState: (CPI) => {
                this.setState( {
                    CPI
                })
            }
        }
    }

    render() {
        return (
            <div className="App empwc">
                <WebchatRender></WebchatRender>
                <div className="empwc__shelf">

                    <div className="empwc__window">
                        <div className="empwc__toggle" id="empwc__toggle">
                            <div className="empwc__notification-dialog" id="empwc__notification-dialog">
                                <p className="empwc__notification-dialog__text">Emplay Webchat v0.0.1-pre-alpha [REACT CPI Engine] </p>
                            </div>
                            <img id="msg-toggle" className="empwc__toggle__icon" alt="" onClick={launchChat}
                                 src="https://s3.amazonaws.com/emplay.botresources/webchat/empbts/common/img/Chatbot_opt3.svg"
                                 width="75px" style={{'border': '1px solid black'}}/>
                        </div>
                        <div className="empwc__chat__shelf empwc__card-shadow" id="empwc-shelf">
                            <div className="empwc__chat__header" id="empwc-header">
                                <div className="empwc__chat__header__head">
                                    <h3 id="userHead" className="empwc__chat__title" style={{'textAlign': 'left'}}>
                                        Emplay Webchat [CPI Engine: <span style={{color: window.CPI.RENDERER_ENABLED ? "limegreen" : "red"}}>{window.CPI.RENDERER_ENABLED ? "On" : "Off"}</span>]
                                    </h3>
                                    <div id="close" className="empwc__chat__close" onClick={hideChat}>
                                        <img
                                            src="https://s3.amazonaws.com/emplay.botresources/webchat/empbts/common/img/close.svg"
                                            alt="" height="3.5rem"/>
                                    </div>
                                </div>
                            </div>
                            <div className="empwc__chat__cont" id={'webchat'}>
                                <Webchat className="" id="webchat" role="main">
                                    <div className="empwc__spinner__shelf">
                                        <div className="loadingio-spinner-wedges-3kcrk4fljim">
                                            <div className="ldio-p1zzu5dm50q">
                                                <div>
                                                    <div>
                                                        <div></div>
                                                    </div>
                                                    <div>
                                                        <div></div>
                                                    </div>
                                                    <div>
                                                        <div></div>
                                                    </div>
                                                    <div>
                                                        <div></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p>Connecting...</p>
                                    </div>

                                </Webchat>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}



const launchChat = () => {
    chat = document.getElementById("empwc-shelf");
    msg = document.getElementById("empwc__toggle");
    chat.style.visibility = "visible";
    chat.style.opacity = "1";
    msg.style.display = "none";
}

// function to close webchat
const hideChat = () => {
    chat = document.getElementById("empwc-shelf");
    msg = document.getElementById("empwc__toggle");
    chat.style.visibility = "hidden";
    chat.style.opacity = "0";
    msg.style.display = "flex";

}




export default App;
