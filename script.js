
/////PUBSUB/////
const pubsub = {

    eventsTracker: {
        // Object to track all the `events: functions()` that call subscribe()
    },

    subscribe: function(eventName, functionName){
        console.log('PubSub log: Someone called subscribe to '+ eventName);

        this.eventsTracker[eventName] = this.eventsTracker[eventName] || [];
        // Tries to assing to a key its own value, if its possible that means the 
        //  event is already being tracked and the logical 'or' resolves true (the 
        //  left side is executed). 
        // If its not possible, that means the event has not yet been introduced 
        //  and the operation resolves false, assigning an empty value (right side).

        this.eventsTracker[eventName].push(functionName);
        // Assigns the function given, as an array item of the eventName key
    },

    unsubscribe: function(eventName, functionNameToDelete){
        console.log('PubSub log: Someone called unsubscribe to '+ eventName);

        // Runs if the event is currently being tracked
        if(this.eventsTracker[eventName]){
            this.eventsTracker[eventName] = this.eventsTracker[eventName].filter(
                functionName => functionName !== functionNameToDelete);
        }
    },

    publish: function(eventName, data){
        console.log(`PubSub log: Running ${eventName} with ${data.value} as the data given`);

        if (this.eventsTracker[eventName]){
            this.eventsTracker[eventName].forEach(
                eventName =>{ eventName(data) }
            );
        }
        // Runs every function in the array atached to the key eventName using `data`
        //  as the parameter.
    }

}


/////EventONE/////
const players = {

    playersListed: [],

    init: function () {    
        console.log(`Players log: Subscribing to playerAdded`);
        pubsub.subscribe('playerAdded', players.playerAdded);
        console.log(`Players log: Subscribing to playerDeleted`);
        pubsub.subscribe('playerDeleted', players.playerDeleted);
        console.log(`Players log: Subscribing to playerUpdated`);    
        pubsub.subscribe('playersUpdated', players.playersUpdated);
    },

    playerAdded: function (playerInput) {

        if(playerInput.value != ""){ 
            players.playersListed.push(playerInput.value);
        }

        let playersList = document.getElementById('playersL');        
        playersList.innerHTML = '';

        let listItem;
        players.playersListed.forEach(name => {
            listItem = document.createElement('li');
            listItem.innerText = name;
            playersList.appendChild(listItem);
        });
        
        playerInput.value = '';

        listItem.addEventListener('click',() => {
            pubsub.publish('playerDeleted', listItem);
        })
        
        let amountPlayers = players.playersListed.length;
        pubsub.publish('playersUpdated', amountPlayers);
    },

    playerDeleted: function(playerToDelete) {
        players.playersListed = players.playersListed.filter(name => name !== playerToDelete.value);

        console.log(players.playersListed );

        let listItem = playerToDelete.closest('li');

        listItem.parentElement.removeChild(listItem);

        pubsub.publish('playersUpdated',players.playersListed.length );
        
    },
    
    playersUpdated: function(amountPlayers){
        let nPlayers = document.getElementById('numberPlayers');
        nPlayers.innerText = amountPlayers;
    }
    
}




/////EventTWO/////






/////Main/////

const playerBtn = document.getElementById('playerBtn');
const playerInput = document.getElementById('playerInput');

const teamBtn = document.getElementById('teamBtn');
const teamInput = document.getElementById('teamInput');

players.init();

playerBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    pubsub.publish('playerAdded', playerInput);
});






















