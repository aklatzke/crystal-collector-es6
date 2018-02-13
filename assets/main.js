$(function(){
    let elements = {
        gems : $(".gem"),
        currentScore : $(".current-score span"),
        targetScore : $(".target-score span"),
        wins : $(".wins span"),
        losses : $(".losses span"),
        actionArea : $(".action-area"),
        actionButton : $(".play-again"),
        phrases : $(".phrases")
    }

    let state = {
        current : 0,
        target : 0
    } 

    let phrases = {
        win: [
            "Fortune and Glory, kid. Fortune and Glory.",
            "Professor of Archaeology, expert on the occult, and how does one say it… obtainer of rare antiquities.",
            "Look at this. It’s worthless — ten dollars from a vendor in the street. But I take it, I bury it in the sand for a thousand years, it becomes priceless. Like the Ark.",
            "We have top men working on it now.” “…Who?” “…Top… men."
        ],

        loss : [
            "Snakes. Why’d it have to be snakes?",
            "Please: sit down before you fall down.",
            "I think it’s time to ask yourself; what do you believe in?",
            "He chose… poorly."
        ]
    }

    let log = {
        wins : localStorage.wins ? parseInt(localStorage.wins) : 0,
        losses : localStorage.losses ? parseInt(localStorage.losses) : 0
    }

    let generateRand = (floor, ceiling) => Math.floor(Math.random() * (ceiling - floor)) + floor ;

    let handler = function(){
        state.current += $(this).data('value');
        updateScores();

        if( state.current > state.target ){
            log.losses++;
            elements.phrases.text( 
                phrases.loss[Math.floor(Math.random() * phrases.loss.length)] 
            ).show();
            reset();
        }
        else if( state.current === state.target ){
            log.wins++;
            elements.phrases.text( 
                phrases.win[Math.floor(Math.random() * phrases.win.length)] 
            ).show();
            reset();
        }

        updateLogs();
    }

    let updateScores = () => {
        elements.currentScore.text(state.current);
        elements.targetScore.text(state.target);        
    }

    let updateLogs = () => {
        localStorage.wins = log.wins;
        localStorage.losses = log.losses;

        elements.wins.text(log.wins);
        elements.losses.text(log.losses);
    }

    let reset = () => {
        elements.actionArea.show();
        elements.actionButton.on("click", init);
    }

    let init = () => {
        let targetVal = generateRand(19, 120);

        elements.gems.each( (index, element) => {
            let rand = generateRand(1, 12);
            $(element).attr("data-value", rand);
        } ) 

        elements.actionArea.hide();
        elements.actionButton.unbind("click");

        state.target = targetVal;
        state.current = 0;

        elements.phrases.hide();

        updateScores();
        updateLogs();

        elements.gems.unbind("click").on("click", handler);
    }

    init();
})