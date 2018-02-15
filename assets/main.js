$(function(){
    /*
        Collect all of the elements that we'll be using throughout the game,
        rather than selecting them each every time we want to use them.

        This allows them to be "cached" essentially and not have to re-select from the
        DOM each time we want to use one.
     */
    let elements = {
        gems : $(".gem"),
        current : $(".current-score span"),
        target : $(".target-score span"),
        wins : $(".wins span"),
        losses : $(".losses span"),
        actionArea : $(".action-area"),
        actionButton : $(".play-again"),
        phrases : $(".phrases")
    }
    /*
        This is going to hold the current game state, essentially the current score,
        the target score, and the wins/losses of the game. The wins/losses will be pulled
        from and saved in localStorage as well.
     */
    let state = {
        current : 0,
        target : 0,
        wins: 0,
        losses: 0
    } 
    /*
        Create a proxy on the "state" object which will handle automatically updating
        both the DOM and localStorage when one of these properties is updated.
     */
    state = new Proxy(state, {
        // We do not need to proxy the "get" value, so we're only
        // defining a new setter
        set : ( target, prop, value ) => {
            // Update the element that corresponds to this prop, they'll
            // be named the same in the elements object. While this is loosely coupled
            // it's obvious enough if something is amiss between the two (as nothing will work!)
            elements[prop].text(value);
            // If the prop is wins or losses, then we want to update localStorage
            if( ["wins", "losses"].indexOf(prop) !== -1 )
                localStorage[prop] = value;
            // Call the reflector so that the object itself updates
            return Reflect.set(target, prop, value)
        }
    })
    /*
        Set up some phrases that we'll pull to update the message if the
        user wins or loses. This could be melded into the "state" object, 
        but directly pulling and setting them is easier to reason about since it
        only happens on game completion.
     */
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
    /*
        Generates a random number between floor and ceiling, inclusive.
     */
    let generateRand = (floor, ceiling) => Math.floor(Math.random() * (ceiling - floor)) + floor ;
    /*
        This is the function we're going to use for the click handler on each of the
        gems.
     */
    let handler = function(){
        // Add the value from the gem to the current state. The DOM will update
        // automatically due to our Proxy above.
        state.current += $(this).data('value');
        // If we've exceeded the target, we lose.
        if( state.current > state.target ){
            state.losses++;
            // Choose a random phrase from the array and show it.
            elements.phrases.text( 
                phrases.loss[Math.floor(Math.random() * phrases.loss.length)] 
            ).show();
            // Call reset() which will show the play again button.
            reset();
        }
        // If we've reached the target, we win!
        else if( state.current === state.target ){
            state.wins++;
            elements.phrases.text( 
                phrases.win[Math.floor(Math.random() * phrases.win.length)] 
            ).show();
            reset();
        }
    }
    /*
        Initializes the game board for another playthrough.
     */
    let init = () => {
        // Each gem should get a data-value attribute equal to a random number between 1 and 12
        elements.gems.each( (index, element) => $(element).attr("data-value", generateRand(1, 12)) ); 
        // Hide the play again button and unbind the click event on
        // the button.
        elements.actionArea.hide();
        elements.actionButton.unbind("click");
        // Generate a random value that will serve as our target.
        state.target = generateRand(19, 120);
        // Set the current to 0, so that we're counting from 0 again.
        state.current = 0;
        // Hide the phrase element, it should only show between games.
        elements.phrases.hide();
        // Unbind existing click events, and then rebind the click event handler.
        // If we do not unbind, each time we run init() we'll end up with another handler.
        // We could also use a boolean on the handler akin to state.pause to halt execution
        // if the game shouldn't run, but this is a bit more elegant.
        elements.gems.unbind("click").on("click", handler);
    }
    /*
        Reset will show the action area, and bind our init() above to the action button
     */
    let reset = () => {
        elements.actionArea.show();
        elements.actionButton.on("click", init);
    }    
    /*
        Pull existing data from localStorage if it exists, otherwise they'll equal 0 from
        the default object.
     */
    state.wins = localStorage.wins ? parseInt(localStorage.wins) : state.wins;
    state.losses = localStorage.losses ? parseInt(localStorage.losses) : state.losses;    
    /*
        Call init() to get things rolling!
     */
    init();
})