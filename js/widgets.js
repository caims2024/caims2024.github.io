/**
 * Class used to add dynamic list features
 * 
 * Constructor parameter (settings) is a JS object with four
 * properties: 
 * listWrapperID - CSS id selector for list wrapper
 * listItemsClass - CSS class for list items (without dot, just name)
 * 
 * processNewItem - function which processes newly created list items, 
 * parameter to processNewItem will be the newly created list item, function
 * must return the newly created item
 * 
 * updateItemsAfterRemove - function which processes all items after an item
 * has been removed from the list
 * 
 * Example:
 * 
 * settings = {
 *  listWrapperId : "#my-list-wrapper",
 *  listItemsClass : "my-list-item",
 *  processNewItem : function(elem){
 *          n = this.getListLength();
 *          elem.find("span").text(`This is item {$n}`);
 *          return elem;
 *  },
 *  updateItemsAfterRemove : function(){
 *    $("#my-list-wrapper").each(function(){do something with this});
 *  }
 * }
 * 
 * let myDynamicList = new DynamicList(settings);
 * 
 * 
 */
class DynamicList{

  constructor(settings)
  {
    this.parentWrapper = $(settings.listWrapperId);
    this.itemsClass = settings.listItemsClass;
    this.processNewItem = settings.processNewItem;
    this.updateItemsAfterRemove = settings.updateItemsAfterRemove;
    this.scrollOnAdd = settings.scrollOnAdd ?? 0;
    this.addButtonText = settings.addButtonText ?? '';
    this.removeMessage = settings.removeMessage ?? 'Are you sure you want to remove this item?';

    this.numberItems = $("." + this.itemsClass).length;
    
    this.addAddButton();
    this.addRemoveButtons();

    this.parentWrapper.on(
      "click", 
      ".dynamic-list-remove-btn",
      (e) => this.removeOneItem(e.target)
    );    
  }

  getListLength()
  {
    return this.numberItems;
  }

  addAddButton()
  {    
    let addButton = $("<div></div>", {
      "class" : "dynamic-list-add-btn"
    });
    
    let button_text = "<button type=\"button\" class=\"btn btn-secondary\">&plus;</button>";
    
    if (this.addButtonText) {
      button_text += `<span class="ms-2">${this.addButtonText}</span>`;
    }
    
    addButton.html(button_text);

    this.parentWrapper.after(addButton);
    
    addButton.click( () => this.addOneItem() );    
  }

  addRemoveButtons()
  {
    let listItems = $("." + this.itemsClass);
    
    listItems.css("position","relative");

    let closeBtn = $("<div></div>", {
      "class" : "dynamic-list-remove-btn"
    });
    let cross = $('<div></div>');
    cross.html("&times;");
    closeBtn.append(cross);
    
    listItems.append(closeBtn); 
  }

  removeOneItem(el)
  {
    if (this.numberItems > 1)
    {
      if (!window.confirm(this.removeMessage)) return;

      $(el).parents("." + this.itemsClass).remove();

      this.numberItems--;

      this.updateItemsAfterRemove();
    }    
  }
 
  addOneItem(params=null)
  {
    let newListItem = this.parentWrapper.children().last().clone();
        
    this.parentWrapper.append(newListItem);

    this.numberItems++;

    this.processNewItem(newListItem, params);

    window.scrollBy({
      top: this.scrollOnAdd,      
      behavior: 'smooth'
    });

  }
  
  removeLastItem()
  {
    if (this.numberItems > 1)
    {
      this.parentWrapper.children().last().remove();
      this.numberItems--;
    }
  }

  removeFirstItem()
  {
    if (this.numberItems > 1)
    {
      this.parentWrapper.children().first().remove();
      this.numberItems--;
    }
    this.updateItemsAfterRemove();
  }

  keepOneItem()
  {
    while (this.numberItems > 1)
    {
      this.removeLastItem();
    }
  }

}

/**
 * Add double click quick edit and preview
 * and show/hide to a textarea or input field
 */
 class walnutForm{

  constructor(settings) {
   this.parentWrapper = document.getElementById(settings.listWrapperId);
   this.listItems = document.querySelectorAll(`.${settings.listItemsClass}`);
   this.previewMethods = settings.previewMethods ? settings.previewMethods : null;
   this.addShowHideButtons = settings.addShowHideButtons ? settings.addShowHideButtons : false;
   
   this.inputTags = settings.editTags.includes("input") ? this.parentWrapper.querySelectorAll("input") : null;
   this.textareaTags = settings.editTags.includes("textarea") ? this.parentWrapper.querySelectorAll("textarea") : null;

   this.MAX_TEXTAREA_HEIGHT = settings.max_textarea_height ?? '1000';
   this.HEIGHT_OFFSET = 8;
   
   this.setTextareaHeights();
   this.addPreviewWrappers();
   this.addShowButtons();

   if (this.addShowHideButton) {
    this.addShowClickListeners(); 
   }
   
   this.addTextareaClickListeners();
   this.addInputTagClickListeners();
   this.addTextareaHeightListeners();
 }

 setTextareaHeights()
 {
   if (this.textareaTags) {
     this.textareaTags.forEach(textarea => {
       if (Number(textarea.scrollHeight) < Number(this.MAX_TEXTAREA_HEIGHT)) {          
         textarea.style.height =  `${textarea.scrollHeight - getPadding(textarea) + this.HEIGHT_OFFSET}px`;
       } else {
         textarea.style.height = `${this.MAX_TEXTAREA_HEIGHT}px`;
       }
     });
   }
 }

 addPreviewWrappers()
 { 
   if (this.inputTags) {
    let inputPreview = document.createElement('div');
    inputPreview.style.display = "none";
    inputPreview.classList.add('input-preview');

    this.inputTags.forEach( el => el.after(inputPreview.cloneNode()) );      
  }

  if (this.textareaTags) {
    this.textareaTags.forEach(textarea => {
     let preview = document.createElement('div');
     preview.style.display = "none";
     preview.classList.add('textarea-preview');
     preview.style.height = `${getHeight(textarea)}px`;
     textarea.after(preview);
   } );
  }
 }

 addShowButtons()
 {
   if (this.textareaTags) {
           
     this.textareaTags.forEach( textarea => {

       textarea.style.display = "none";

       let button = document.createElement('button');
       button.classList.add('show-hide-button');
       button.setAttribute('type', 'button');

       if (!textarea.value) {
         textarea.classList.add("active");
         button.innerHTML = 'Show';
       } else {
         let divPreview = textarea.parentNode.querySelector('.textarea-preview');
         divPreview.innerHTML = textarea.value;
         divPreview.style.display = "block";
         divPreview.classList.add('active');
         button.innerHTML = 'Hide';
       }

       if (this.addShowHideButtons) {
        textarea.before(button);
       }

     });      
   }

   if (this.inputTags) {
           
     this.inputTags.forEach( input => {

       if (!input.value) {
         input.classList.add("active");
       } else {
         input.style.display = "none";
         let divPreview = input.parentNode.querySelector('.input-preview');
         divPreview.innerHTML = input.value;
         divPreview.style.display = "inline-block";
         divPreview.classList.add('active');
       }

     });
   }
 }

 addShowClickListeners()
 {
   this.parentWrapper.addEventListener('click', e => {
     if (e.target.classList.contains('show-hide-button'))
     {
       this.toggleShowHideTextarea(e.target);
     }
   });    
 }

 toggleShowHideTextarea(button)
 {    
   if (button.innerHTML == 'Show')
   {
     button.parentNode.querySelector(".active").style.display = "block";
     button.innerHTML = 'Hide';
   } else {
     button.parentNode.querySelector(".active").style.display = "none";
     button.innerHTML = 'Show';
   }

 }

 addTextareaClickListeners()
 {
   if (!this.textareaTags) return;

   // dblclick listener for the textarea
   this.parentWrapper.addEventListener("dblclick", e => {

     let closestActive = e.target.closest('.active');

     if (closestActive && closestActive.tagName.toLowerCase() == 'textarea')
     {
       this.toggleTextareaPreview(closestActive);
     }

   });

   // click listener for the preview
   this.parentWrapper.addEventListener("click", e => {

     let closestActive = e.target.closest('.active');

     if (closestActive && closestActive.classList.contains('textarea-preview'))
     {
       this.toggleTextareaPreview(closestActive);
     }

   });

 }
 
 addInputTagClickListeners()
 {   
   
   if (!this.inputTags) return;

   // dblclick listener for the inputs
   this.parentWrapper.addEventListener("dblclick", e => {

     let closestActive = e.target.closest('.active');

     if (closestActive && closestActive.tagName.toLowerCase() == 'input')
     {
       this.toggleInputPreview(closestActive);
     }

   });

   // click listener for the preview
   this.parentWrapper.addEventListener("click", e => {

     let closestActive = e.target.closest('.active');

     if (closestActive && closestActive.classList.contains('input-preview'))
     {
       this.toggleInputPreview(closestActive);
     }

   });

 }

 toggleTextareaPreview(elem)
 {    
   
   if (elem.tagName.toLowerCase() == 'textarea') {

     let preview = elem.parentNode.querySelector('.textarea-preview');

     preview.innerHTML = elem.value;
     preview.style.height = `${getHeight(elem)}px`;
     preview.classList.add('active');
     preview.style.display = "block";

     // Run desired methods to re-render any special markup        
     if (this.previewMethods)
     {          
       this.previewMethods.forEach(method => method());
     }
   } else {
     // Hide preview and show textarea
     let textarea = elem.parentNode.querySelector('textarea');
     textarea.style.display = "block";
     textarea.classList.add('active');
     textarea.focus();
   }

   elem.style.display = "none";
   elem.classList.remove('active');

 }

 toggleInputPreview(elem)
 {    
   elem.style.display = "none";
   elem.classList.remove('active');

   if (elem.tagName.toLowerCase() == 'input')
   {
     let inputPreview = elem.parentNode.querySelector('.input-preview');
     inputPreview.innerHTML = elem.value;
     inputPreview.style.display = "inline-block";
     inputPreview.classList.add('active');
   } else {
     let input = elem.parentNode.querySelector('input');
     input.style.display = "inline-block";
     input.classList.add('active');
     input.focus();      
   }

 }

 addTextareaHeightListeners() {
   this.textareaTags.forEach(textarea => {
     textarea.addEventListener('input', e => {
       textarea.style.height = 'auto';
       textarea.style.height = (textarea.scrollHeight-getPadding(textarea)+this.HEIGHT_OFFSET) + 'px';
     });
   });    
 }

}

/**
 * 
 * @param {element} textarea
 * Adds auto height adjustment to textareas
 */
function responsiveTextarea(textarea) {

  const HEIGHT_OFFSET = 16;

  textarea.addEventListener('input', e => {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight - getPadding(textarea) + HEIGHT_OFFSET) + 'px';
  });
}

/** Utility function to get height of element */
function getHeight(el) {
  return Number(
    window
    .getComputedStyle(el)
    .getPropertyValue('height')
    .replace('px', '')
  );
}

/**
 * Utility function to get padding of element
 */
getPadding = el => el.offsetHeight - getHeight(el);

/**
 * Used to clear date and time HTML inputs
 * 
 * @param e Click event
 */
function clearDateTime(e) {
    e.preventDefault();
    console.log(e);
    $("input[type=date]").val("");        
    $("input[type=time]").val("");        
}

// Show overlay
function showOverlay(message) {
  // Create overlay div
  const overlay = document.createElement('div');
  overlay.id = 'overlay';

  // Apply styles directly
  overlay.style.display = 'none';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '9999';

  // Create loading message
  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = message ?? 'SAVING ...';

  // Apply styles directly to the loading message
  loadingMessage.style.color = 'white';
  loadingMessage.style.textAlign = 'center';
  loadingMessage.style.position = 'absolute';
  loadingMessage.style.top = '50%';
  loadingMessage.style.left = '50%';
  loadingMessage.style.transform = 'translate(-50%, -50%)';

  // Append loading message to overlay
  overlay.appendChild(loadingMessage);

  // Append overlay to body
  document.body.appendChild(overlay);

  // Show overlay
  overlay.style.display = 'block';
}

// Function to hide the overlay
function hideOverlay() {
  document.getElementById('overlay').style.display = 'none';
}
