## Key Press Action
Configure a mx action on specific key presses

## Features
- Supports multi key operations with Shift, Alt, Ctrl, and Meta (Mac command & Windows key)
- Watch either the whole document or a specific container
- Configure a list of key actions to be executed
- Uses the [qualified name of a key](https://www.w3.org/TR/uievents-key/#named-key-attribute-values) instead of the number


## Limitations
- The widget's functionality is intentionally bare-bones with the expectation that the Mendix developer configures the functionality inside the Microflow / Nanoflow of the key action.

## Usage
![general](https://github.com/bsgriggs/mendix-key-press-action/blob/media/general.png)  
1. Add the widget to your page and determine whether you want to watch the whole document or only a specific section of your page. If you need to have your action use specific objects, then use Watch mode "Specific Content"
![keyEvent](https://github.com/bsgriggs/mendix-key-press-action/blob/media/keyEvent.png)  
2. Add a new item to the Key watch list
3. Add the [qualified name of the key](https://www.w3.org/TR/uievents-key/#named-key-attribute-values) in the Key name
4. If you need this key action to only run when multiple keys are pressed, enable key combination then select with secondary system key to watch
5. Add a Microflow or Nanoflow to execute when the key is detected

## Example - Excel-like list navigation
![demo](https://github.com/bsgriggs/mendix-key-press-action/blob/media/demo.gif)  
*Requires the Web Actions module on the marketplace*
1. You will need to have a domain model with of the following features:
   - An object that is the root of the data structure
   - The objects that appear in the first list view should have an integer (SequenceNr) that is unique per root object.  
![domain](https://github.com/bsgriggs/mendix-key-press-action/blob/media/domain.png)  
2. Have a list view that returns your row objects sorted by the SequenceNr
3. Inside the list view, add the Key Press Action widget with Watch mode set to "Specific Content"
4. Add your actual list view content inside the Key Press Action's container  
![pageStructure](https://github.com/bsgriggs/mendix-key-press-action/blob/media/pageStructure.png)  
6. Add to the key watch list an item for each arrow key
   - Key name: ArrowUp, ArrowRight, ArrowLeft, ArrowDown
   - A **Nanoflow** for each key (i.e. ACT_Row_KeyUp, ACT_Row_KeyRight) 
7. In ACT_Row_KeyDown, add logic to determine if the current row is the last row (by SequenceNr). If the current row is not the highest row, do a while loop that runs the Focus Next action for the number of items in a row (9 in the example image).  
![ACT_Row_KeyDown](https://github.com/bsgriggs/mendix-key-press-action/blob/media/ACT_Row_KeyDown.png) 
8. In ACT_Row_KeyUp, copy the the logic in ACT_Row_KeyDown. Change the sort action to look for the lowest row and make sure the current row is not the lowest row. Change Focus Next to Focus Previous.
9. Create a new java script action called "JSA_ActiveElementContainsClassName" with the following settings:
   - add a string parameter called "ClassName"
   - set the return value to a boolean
10. Paste the following code into the java script action
```
if (className.trim() !== ""){
	const activeElement = document.activeElement;
	if (activeElement){
		return (activeElement.closest(className) !== null);
	}
} 
return false;
```
11. Inside your list view content, add the class name 'col-first' to the first textbox in the row. Add 'col-last' to the last textbox or button in the row.
12. In ACT_Row_KeyRight, add JSA_ActiveElementContainsClassName and give it '.col-last'. If the java script action returns true, do nothing. If the java script action returns false, run Focus Next.
![ACT_Row_KeyRight](https://github.com/bsgriggs/mendix-key-press-action/blob/media/ACT_Row_KeyRight.png)  
13. In ACT_Row_KeyLeft, add JSA_ActiveElementContainsClassName and pass it '.col-first'. If the java script action returns true, do nothing. If the java script action returns false, run Focus Previous.
14. Run the project and click on your first text box, you should now be able to navigate the list view with the arrow keys

## Demo project

https://widgettesting105-sandbox.mxapps.io/p/key-press-action

## Issues, suggestions and feature requests

https://github.com/bsgriggs/mendix-key-press-action/issues

## Development and contribution

Benjamin Griggs
