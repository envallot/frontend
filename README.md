Enve-Allot implements the envelope budgeting system. When people get paychecks, they divide the cash into envelopes marked with categories. For instance, when you want to buy a diet coke, you take out a dollar from the envelope marked 'Sodas'. 

In this app, you can create an item by clicking the '+' icon next to 'Items'. Next, click on the '+' next to 'Envelopes'. Drag the item to the envelope, and click on the envelope. Click on the item the envelope to take out, and drag the envelope to the trashcan to delete it. Or, just drag the envelope with the item over to '+ Items'. When an envelope's total has reached its limit, you can not place any more items in, modeling how envelopes work in real life. 


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## In Detail

* Create react app with typescript was used
* No register or login required
* No global state handler such as redux is used
* Modals are used extensively for easy navigation
* Simple and fast UI interface with data validation
* Formless update to reduce clutter

## Challenges

### `Drag and Drop`

Drag and drop was implemented without a third party library. It uses props to know what to do on drag end or on drag start. Actions that pertain to the dragged component are defined and executed within the component.

### `Formless Update`

To update your username, or various item or envelope properties, you can simply type them in instead of opening a form. A debouncer costum hook is used to accomplish this.

### `Fast User Interface`

To accomplish a snappy interface, we update data without first running the API call. If there is an error, we revert application state back to the last persisted valid state. Test this out by updating an item to have a blank name.

