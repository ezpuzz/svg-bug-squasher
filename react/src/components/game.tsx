import React from 'react';
import './theme.css';

const Game: React.FC = () => {
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = "http://cdnjs.cloudflare.com/ajax/libs/paper.js/0.9.18/paper-full.js";
        script.async = true;
        script.onload = () => {
            const paperScript = document.createElement('script');
            paperScript.type = 'text/paperscript';
            paperScript.setAttribute('canvas', 'game');
            paperScript.src = './game.js';
            document.body.appendChild(paperScript);
        };
        document.body.appendChild(script);
    }, []);

    return (
        <canvas id="game" resize="true"></canvas>
    );
};

export default Game;
