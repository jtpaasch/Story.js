Story.js
========

A javascript module that lets you define a sequence of events, and how to respond to them. Suppose you want a popup to appear only after a particular user story --- e.g., the user first clicks here, then they click there. Story.js allows you to define that sequence and the response.

For a quick example, open index.html in a web browser and try it out.

Usage
-----

First, include the javacsript file somewhere on your page, e.g., like this:

       <script src="js/story.min.js"></script>

After that, you can create any number of stories. To create a story, first instantiate the module:

      var story = new Story();

Then chain events together. The basic syntax is this:

     story.event().event().event();

Inside each event() method, include an object that identifies three things:

* _watch_for : eventType_ --- what type of event to watch for, e.g., `click`.
* _on : selector_ --- a valid CSS selector that identifies the item(s) you want to watch, e.g., `#myelement`, `.my-class`, or even `button`. 
* _response : function_ --- The function to execute when the event occurs. 

Inside each response function, you can perform whatever logic you like, but you need to tell it whether it can start listening for the next event in the sequence, whether it should listen again for a repeat event, or whether it should stop listening altogether. You can do that with `this.continue()`, `this.repeat()`, and `this.stop()`, respectively.

Example
-------

This opens an alert when the user first clicks an element with an id of `my-element`, then clicks any element with a class of `.my-class`:

    story.event({
             'watch_for': 'click',
             'on': '#my-element',
             'response': function() {
                 this.continue();
             }
         }).event({
             'watch_for': 'click',
             'on': '.my-class',
             'response': function() {
                 window.alert('Hello world!')
             }
         });


Multi-page stories
------------------

Story.js only works for stories that occur on one page. If you want it to apply across multiple pages, you can certainly get creative and bootstrap it for that purpose.
