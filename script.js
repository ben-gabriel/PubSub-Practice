
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
        console.log(`PubSub log: Running ${eventName} with ${data} as the data given`);

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


/////EventTWO/////