/**
 *  The `Story` module lets you specify a sequence
 *  of events, and how to respond to each of them. 
 *
 *  @author JT Paasch jt dot paasch at gmail
 *  @copyright Copyright 2013 JT Paasch
 *  @license Distruted under the LGPL license: 
 *           http://www.gnu.org/licenses/lgpl.txt
 */
var Story = Story || (function() {

    /**
     *  We'll store a reference to this module here (for convenience).
     *
     *  @var Story instance
     */
    var self = null;

    /**
     *  All events will be stored in this list.
     *
     *  @var Array
     */
    var events = [];

    /**
     *  A reference to the current event in the sequence.
     *
     *  @var Integer
     */
    var cursor = 0;

    /**
     *  Aliases to various versions of `matchesSelector`.
     *
     *  @var Function or false.
     */
    var matches = Element.prototype.matchesSelector || 
                  Element.prototype.webkitMatchesSelector ||
                  Element.prototype.mozMatchesSelector ||
                  Element.prototype.msMatchesSelector || 
                  false;

    /**
     *  Add an event listener to an element.
     *
     *  @param Element element The element to listen to.
     *  @param String type The type of event to listen for, e.g., 'click'.
     *  @param Function callback The callback when the event occurs.
     *  @return void
     */
    var add_event_listener = function(element, type, callback) {

        // Modern browsers use addEventListener to attach events.
        if (document.addEventListener) {
            return element.addEventListener(type, callback, false);
        } 

        // IE 8 uses attachEvent to attach events.
        else {
            return element.attachEvent('on' + type, callback);
        }

    };

    /**
     *  Remove an event listener from an element.
     *
     *  @param Element element The element to remove the listener from.
     *  @param String type The type of event to stop listening for.
     *  @param Function callback The callback to remove.
     *  @return void
     */
    var remove_event_listener = function(element, type, callback) {

        // Modern browsers use removeEventListener to remove events.
        if (document.removeEventListener) {
            return element.removeEventListener(type, callback, false);
        } 

        // IE 8 uses detachEvent to attach events.
        else {
            return element.detachEvent('on' + type, callback);
        }

    };

    /**
     *  Does the selector legitimately match the element?
     *
     *  @param Element element The element to check.
     *  @param String selector A valid CSS selector.
     */
    var match_selector = function(element, selector) {

        // Modern browsers can use matchesSelector (mapped to `matches`).
        if (matches) {
            return matches.call(element, selector);
        }

        // For other browsers, we'll do it manually.
        else {
            var elements = document.querySelectorAll(selector),
                max = elements.length,
                i = 0;
            for (i; i < max; i += 1) {
                if (elements[i] === element) {
                    return true;
                }
            }
        }

    };

    /**
     *  Stop the story. This is done by nullifying the cursor.
     *
     *  @return void
     */
    var stop = function() {
        cursor = null;        
    };

    /**
     *  Move on to the next event in the sequence.
     *  This is done by moving the cursor up one.
     *
     *  @return void
     */
    var next = function() {
        cursor += 1;
    };

    /**
     *  Repeat the current event. 
     *  This is done by leaving the cursor where it is.
     *
     *  @return void
     */
    var repeat = function() {
        // Do nothing.
    };

    /**
     *  Register an event in a story.
     *
     *  @param Object details Specifies the details of the event.
     *  @return Stories instance.
     */
    var event = function(details) {

        // Define `self` if it's not defined already.
        if (self === null) {
            self = this;
        }

        // Add the event to the story's sequence of events.
        events.push(details);

        // Are we watching for an event like 'click'? 
        if ('watch_for' in details) {
            register_event(details);
        }

        // Return the module, so that we can chain methods.
        return this;

    };

    /**
     *  Add an event listener to an element.
     *
     *  @param Object details The details of the event.
     */
    var register_event = function(details) {

        // Get the element to listen to.
        var elements = document.querySelectorAll(details.on);

        // Attach an event listener to each selected element.
        var i = 0,
            max = elements.length;
        for (i; i < max; i += 1) {
            add_event_listener(
                elements[i], 
                details.watch_for, 
                listen_for_event
            );
        }

    };

    /**
     *  When registered events occur, this method
     *  is called. It proceeds to call the response
     *  defined for the event the cursor is currently
     *  pointing at.
     *
     *  @param Event event The DOM event that triggered this.
     *  @return void
     */
    var listen_for_event = function(event) {

        // Only proceed if we have a legitimate cursor.
        if (cursor !== null) {

            // Get a reference to the object the cursor 
            // points to in the sequence.
            var current = events[cursor];

            // What is the element that triggered this? 
            var target = event.target || event.srcElement;

            // Is it selected by the selector?
            var is_selected = match_selector(target, current.on);

            // If so, execute the response.
            if (is_selected) {
                current.response.call(self, event);
            }

        }

    };

    /**
     *  Return aliases to certain methods.
     *  That will make them public.
     *
     *  @return Object
     */
    return {
        // events: events, // Uncomment for debugging
        event: event,
        stop: stop,
        'continue': next,
        repeat: repeat
    };

});
