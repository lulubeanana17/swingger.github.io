import { useEffect, useState } from "react";

const Menu = (number) => {
    const [state, setState] = useState(0);

    const OnScroll = (event) => {
        event.preventDefault();
        if(number === 0) {
            const layerY = document.querySelector(".sensor").getBoundingClientRect().y;
            const layerT = document.querySelector(".profileSignTitle").getBoundingClientRect().y;
    
            if((layerY - layerT) < 40) {
                setState(1);
            } else if((layerY - layerT) > 40) {
                setState(0);
            }
        }
        
    };

    useEffect(() => {
        document.querySelector(".nweets").addEventListener("scroll", OnScroll);
      }, []);

    return state;
};

export default Menu;