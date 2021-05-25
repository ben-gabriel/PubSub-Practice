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
        console.log(`Players log: Someone called playerAdded`);

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
        
        let htmlCollection = playersList.children;
        for (let index = 0; index < htmlCollection.length; index++) {
            htmlCollection.item(index).addEventListener('click', 
            () =>{
                pubsub.publish('playerDeleted', htmlCollection.item(index));
            });
        }
        
        playerInput.value = '';
        let amountPlayers = players.playersListed.length;
        pubsub.publish('playersUpdated', amountPlayers);
    },

    playerDeleted: function(playerToDelete) {
        console.log(`Players log: Someone called playerDeleted`);
        players.playersListed = players.playersListed.filter(name => name !== playerToDelete.innerText);

        let listItem = playerToDelete.closest('li');

        listItem.parentElement.removeChild(listItem);

        pubsub.publish('playersUpdated', players.playersListed.length);
        
    },
    
    playersUpdated: function(amountPlayers){
        console.log(`Players log: Someone called playersUpdated`);
        let nPlayers = document.getElementById('numberPlayers');
        nPlayers.innerText = amountPlayers;
        console.log(document.getElementById('playersL').children);
    }
    
}

/////EventTWO/////
const teams = {
    teamsListed: [],
  
    init: function () {    
        console.log(`Teams log: Subscribing to teamAdded`);
        pubsub.subscribe('teamAdded', teams.teamAdded);
        console.log(`Teams log: Subscribing to teamDeleted`);
        pubsub.subscribe('teamDeleted', teams.teamDeleted);
        console.log(`Teams log: Subscribing to teamUpdated`);    
        pubsub.subscribe('teamsUpdated', teams.teamsUpdated);
    },
  
    teamAdded: function (teamInput) {
        console.log(`Teams log: Someone called teamAdded`);
  
        if(teamInput.value != ""){ 
            teams.teamsListed.push(teamInput.value);
        }
  
        let teamList = document.getElementById('teamsL');        
        teamList.innerHTML = '';
  
        let listItem;
        teams.teamsListed.forEach(name => {
            listItem = document.createElement('li');
            listItem.innerText = name;
            teamList.appendChild(listItem);            
        });
        
        let htmlCollection = teamList.children;
        for (let index = 0; index < htmlCollection.length; index++) {
            htmlCollection.item(index).addEventListener('click', 
            () =>{
                pubsub.publish('teamDeleted', htmlCollection.item(index));
            });
        }
        
        teamInput.value = '';
        let amountTeams = teams.teamsListed.length;
        pubsub.publish('teamsUpdated', amountTeams);
    },
  
    teamDeleted: function(teamToDelete) {
        console.log(`Teams log: Someone called teamDeleted`);
        teams.teamsListed = teams.teamsListed.filter(name => name !== teamToDelete.innerText);
  
        let listItem = teamToDelete.closest('li');
  
        listItem.parentElement.removeChild(listItem);
  
        pubsub.publish('teamUpdated', teams.teamsListed.length);
        
    },
    
    teamsUpdated: function(amountTeams){
        console.log(`Teams log: Someone called teamsUpdated`);
        let nTeams = document.getElementById('numberTeams');
        nTeams.innerText = amountTeams;
        console.log(document.getElementById('teamsL').children);
    }
    
  }

/////Main/////
const playerBtn = document.getElementById('playerBtn');
const playerInput = document.getElementById('playerInput');

const teamBtn = document.getElementById('teamBtn');
const teamInput = document.getElementById('teamInput');

players.init();
teams.init();

playerBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    pubsub.publish('playerAdded', playerInput);
});

teamBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    pubsub.publish('teamAdded', teamInput);
});


/////example content, to start with data/////
playerInput.value='Jhony Cruz';
players.playerAdded(playerInput);

playerInput.value='Serena Williams';
players.playerAdded(playerInput);

playerInput.value='Michael Jordan';
players.playerAdded(playerInput);


teamInput.value='Chicago Bulls';
teams.teamAdded(teamInput);

teamInput.value='FC Barcelona';
teams.teamAdded(teamInput);
