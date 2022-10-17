let list = document.getElementById("single-linked-list");


// Returns empty svg obj with set attributes
const createNewCanvas = () =>{
    newCanvas = document.createElementNS("http://www.w3.org/2000/svg","svg");
    newCanvas.setAttribute("preserveAspectRatio","none");
    newCanvas.setAttribute("width","100%");
    newCanvas.setAttribute("height","100%");
    newCanvas.setAttribute("viewBox","0 0 100 100");
    newCanvas.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    return newCanvas;
}

// Takes 2 parameters: start - Y pos of Left node and end - Y pos of Right node
// Returns path obj
const createNewPath = (start,end) =>{
    
    let newPath = document.createElementNS("http://www.w3.org/2000/svg","path");

    newPath.setAttribute('d','M 0,'+start+' 100,'+end);
    newPath.setAttribute('marker-end',"url(#arrow)")
    return newPath
}

// Takes 2 parameters: starting node and ending node
// Calculates relative position of starting node to ending node
// Returns array with 2 numbers, from 0 to 100
const getNodePos = (startingNode,endingNode) => {
    
    let listHeight = window.getComputedStyle(list).height.slice(0,-2);

    let startingNodeHeight = window.getComputedStyle(startingNode).height.slice(0,-2);
    let startingNodeMarginTop = window.getComputedStyle(startingNode).marginTop.slice(0,-2); 

    // get node position
    let startingNodePercentFromTop = (startingNodeMarginTop/listHeight)*100;
    // get center of node
    let startingNodePercent = (startingNodeHeight/listHeight)*100/2;
    // get final position
    let startingNodeFinalPos = startingNodePercentFromTop + startingNodePercent;

    let endingNodeHeight = window.getComputedStyle(endingNode).height.slice(0,-2);
    let endingNodeMarginTop = window.getComputedStyle(endingNode).marginTop.slice(0,-2); 
    
    let endingNodePercentFromTop = (endingNodeMarginTop/listHeight)*100;
    let endingNodePercent = (endingNodeHeight/listHeight)*100/2;
    let endingNodeFinalPos = endingNodePercentFromTop +  endingNodePercent;
    
    return [startingNodeFinalPos.toFixed(2),endingNodeFinalPos.toFixed(2)];
};

// return empty div with class 'connector'
const createConnector=()=>{
    let newConnector = document.createElement('div');
    newConnector.classList.add('connector');
    
    return newConnector;
};

// Inserts Connector between two nodes
// takes 3 parameters: empty connector, element - node of intrest and position: 'end' - after node 'front' - before node
// returns connector obj
const InsertConnector=(connector,element,position)=>{
    
    if(position=='end'){
        element.insertAdjacentElement('afterend',connector)
        
    }else if(position=='front'){
        element.insertAdjacentElement('beforebegin',connector)
    }
    return connector
}

// Creates complete svg arrow between two nodes
// Takes 3 parameters: empty connnector, node1 - starting node obj, node2 - ending node obj
const connectNodes = (connector,node1,node2) =>{
    
    let newCanvas = createNewCanvas();
    connector.appendChild(newCanvas);

    let newPath = createNewPath(getNodePos(node1,node2)[0],getNodePos(node1,node2)[1]);
    newCanvas.appendChild(newPath);
}

// Creates empty node obj
// returns node obj
const createNode=()=>{
    let node = document.createElement("li");
    node.classList.add('node-base');

    let data = document.createElement('div');
    data.innerText = 'Data'
    data.classList.add('data');
    let dataValue = document.createElement("p");
    dataValue.innerText = 'Val'
    data.appendChild(dataValue)

    let nextNode = document.createElement('div');
    nextNode.innerText = 'Next'
    nextNode.classList.add('next');
    let nextNodeValue = document.createElement("p");
    nextNode.appendChild(nextNodeValue)

    node.appendChild(data);
    node.appendChild(nextNode);

    return node
}

// Creates pop up messege
// takes message parameter

const popUp=(message)=>{
    if(!document.getElementById('popup')){
        
        let popUpWindow = document.createElement('p')
        popUpWindow.innerText = message
        popUpWindow.classList.add('popup')
        popUpWindow.setAttribute('id','popup')
        document.getElementById('pops').append(popUpWindow)

        popUpWindow.addEventListener("animationend", deletePopup=()=>{popUpWindow.remove()} );
    }
}

// Insert node to the list in given position
// Call functions: handleHeadTail, refresh, allNodesDragable, handleValues, editableValues
// Takes 3 parameters: element - place of insertion, position: 'front' - in front of elemnt, 'end' - after element, undefined - insert directly into the list and node - obj thats being inserted
const addNode=(element,position,node)=>{   
    let allNodes = document.querySelectorAll('.node-base') 

    if(allNodes.length == 5){
        popUp('Max number of nodes in list is 5')
        return
    }

    let connector = createConnector();
    let head;
    let tail;

    node = node ?? createNode()

    if(allNodes.length > 0){
        head = allNodes[0]
    }

    if(allNodes.length > 1){
        tail = allNodes[allNodes.length-1]
    }
    
    if(head || tail ){
        if(element == 'head'){
            element = head
        }else if(element == 'tail'){
            if(!tail){
                element = head
            }else{element = tail}
        }

        if (position == 'front'){
            element.insertAdjacentElement('beforebegin',node)
            connectNodes(
                InsertConnector(connector,node,'end'),
                node,
                node.nextElementSibling)
           
        }else if(position == 'end'){
            element.insertAdjacentElement('afterend',node)
            connectNodes(
                InsertConnector(connector,node,'front'),
                node.previousElementSibling,
                node)
               
        }
    }else{
        list.insertBefore(node,list.children[0])     
    }
    
    refreshPaths();
    handleHeadTail();
    allNodesDragable();
    handleValues();
    editableValues();
}

// Decides which node gets 'head','tail' and 'base-node' class or attribute and handles their margins
// calls SetMargin function on all nodes
const handleHeadTail=()=>{
    let allNodes = document.querySelectorAll('.node-base');
    
    for (let i = 0; i < allNodes.length; i++){

        allNodes[i].classList.remove('head','tail')
        allNodes[i].removeAttribute('id')

        if(allNodes.length == 1){
            allNodes[0].classList.add('head')
            allNodes[0].setAttribute('id','head')
        }
       
        else if(allNodes.length >= 2){
            allNodes[0].classList.add('head')
            allNodes[0].setAttribute('id','head')

            allNodes[allNodes.length-1].classList.add('tail')
            allNodes[allNodes.length-1].setAttribute('id','tail')
        }
        setMargins(allNodes[i])   
    }
}

// sets node margins to default for each type of node
// takes in 1 parameter - node
const setMargins=(element)=>{
    let allNodes = document.querySelectorAll('.node-base')
    
    if(!element.classList.contains('head') && !element.classList.contains('tail')){
        element.style.marginLeft = '30px'
        element.style.marginRight = '0px'
    }
    else if(element.classList.contains('head')){
        if(allNodes.length == 1){
            element.style.marginRight = 'auto'
            element.style.marginLeft = 'auto'
        }else{
            element.style.marginRight = '0px'
            element.style.marginLeft = 'auto'
            element.nextElementSibling.style.marginLeft = '0px'
        }
    }
    else if(element.classList.contains('tail')){
        element.style.marginLeft = '30px'
        element.style.marginRight = 'auto'
    }
}

// expects mouse event
// Drags node in relative position on Y axis, after 50px calls dragAbs function, if dropped erlier returns to original position]
// Calls refresh function
const drag=(event)=>{
    event.preventDefault();

    let y = event.pageY;
    let newY = lastY - y
    let elemMarginTop = window.getComputedStyle(elem).marginTop.slice(0,-2)

    if(newY >= 0 && newY <= 60){
        if (lastseenY < newY){
            lastseenY = newY

            elemMarginTop--;

            if ((elemInitMarginTop - newY) != elemMarginTop){
                elemMarginTop = elemInitMarginTop - newY
            }

            elem.style.marginTop = elemMarginTop + 'px';
        }else{
            lastseenY = newY

            elemMarginTop++;

            if ((elemInitMarginTop - newY) != elemMarginTop){
                elemMarginTop = elemInitMarginTop - newY
            }

            elem.style.marginTop = elemMarginTop + 'px';          
        }
        if (newY >= 50){
            elem.classList.add('drag-abs')
            document.onmouseup = dropAbs;
            document.onmousemove = dragAbs;
            
            oldY = y
            if(elem.previousElementSibling && elem.previousElementSibling.classList.contains('connector')){
                elem.previousElementSibling.remove()
            }
            if(elem.nextElementSibling && elem.nextElementSibling.classList.contains('connector')){
                elem.nextElementSibling.remove()
            }     
        }
        refreshPaths();
    }
    
}

// Called on mouseup event. Returns element to original position and clears onmouseup and onmousemove events
// Calls refresh function
const drop=()=>{
    document.onmouseup = null;
    document.onmousemove = null;

    if(lastseenY < 50){
        elem.style.marginTop = elemInitMarginTop + 'px';
        refreshPaths();
    }
    
}

// Called on mousedown event. Calls drag or dragAbs Functions and assigns coresponding events, depending on target status.
const pickUp=(event)=>{
    event.preventDefault();
    let y = event.pageY;
    
    elem = event.target.closest('li')
    elem.classList.remove('trans')

    if(elem.classList.contains('drag-abs')){
        document.onmousemove = dragAbs;
        document.onmouseup = dropAbs;
        
    }
    else{
        lastY = y
        lastseenY = 0;

        elemInitMarginTop = window.getComputedStyle(elem).marginTop.slice(0,-2);
        
        document.onmousemove = drag;
        document.onmouseup = drop;
    }
}

// allows all node-base elements to be draged in relative position
const allNodesDragable=()=>{
    allNodes = document.querySelectorAll('.node-base');
    
    for (let i = 0; i < allNodes.length; i++){
        allNodes[i].onmousedown = pickUp;
    };
}
// allows mousemove to changes element absolute position within list area
// moves element to last position in list and changes it class
// on first event calls function  handleHeadTail, addBBToAllNodes, handleMissingConnectors, handleValues
const dragAbs=(event)=>{
    event.preventDefault();
    let x = event.pageX;
    let y = event.pageY;
    
    let elemWidth = elem.offsetWidth
    let listHeight = window.getComputedStyle(list).height.slice(0,-2)

    finalX = x - (elemWidth/2) - 30
    finalY = y - oldY + (listHeight/2) + 30
    listWidth = window.getComputedStyle(list).width.slice(0,-2);
    
    list.children[list.children.length-1].insertAdjacentElement('afterend',elem)

    if(elem.classList.contains('node-base')){
        elem.classList.remove('node-base')
        elem.classList.remove('tail')
        elem.classList.remove('head')
        elem.removeAttribute('id')
        elem.style.zIndex = 0

        handleHeadTail();
        addBBToAllNodes();
        handleMissingConnectors();
        handleValues();
    }
    if(finalX > -30 && finalX < listWidth - elemWidth - 30){
        elem.style.left =  finalX + 'px'
    }
    if(finalY < 285 && finalY > -10){
        elem.style.top =  finalY  + 'px'
    }
}
// drops element in list area and allows it to be picked up again
// resets element position if droped too close to existing list items
// calls 2 functions removeBBFromAllNodes and editableValues
const dropAbs=(event)=>{
    event.preventDefault();
    
    if(finalY < (list.offsetHeight/2 + 40) && finalY > (list.offsetHeight/2 - 80)){
        elem.style.top =  '70px'
    }

    document.onmousemove = null
    elem.onmousedown = pickUpAbs
    removeBBFromAllNodes()
    editableValues();
    
    
}
// allows element in absolute position to be picked up
// calls function addBBToAllNodes
const pickUpAbs=(event)=>{
    event.preventDefault();
    let y = event.pageY;
    
    if (event.target.classList.contains('drag-abs')){
        elem = event.target
    }else{
        return
    };

    elem.classList.remove('trans')
    lastY = y

    document.onmousemove = dragAbs;
    document.onmouseup = dropAbs;
    addBBToAllNodes();
}
// reconnects nodes after one of them is picked off the list
const handleMissingConnectors=()=>{
    let allNodes = document.querySelectorAll('.node-base');
    
    for (let i = 0; i < allNodes.length; i++){
        currNode = allNodes[i]

        let prevElem = currNode.previousElementSibling;
        let nextElem = currNode.nextElementSibling;
        
        if (prevElem && prevElem.classList.contains("node-base")  ){
            
            let connector = InsertConnector(createConnector(),currNode,'front')
            connectNodes(connector,prevElem,currNode)   

        }else if (nextElem && prevElem && nextElem.classList.contains("node-base")){
            
            let connector = InsertConnector(createConnector(),currNode,'end')
            connectNodes(connector,prevElem.previousElementSibling,nextElem)
        }
    }
}
// refreshes svg position beetween all nodes
// calls 2 functions allNodesDragable, editableValues
const refreshPaths=()=>{
    let allConnectors = document.querySelectorAll(".connector")

    if (allConnectors.length > 0){
        for (let i = 0; i < allConnectors.length; i++) {

            let connector = allConnectors[i]
            let newpath;
            let prevNode= connector.previousElementSibling
            let nextNode= connector.nextElementSibling
            let oldpath = connector.children[0].children[0]

            newpath = createNewPath(
                getNodePos(prevNode,nextNode)[0],
                getNodePos(prevNode,nextNode)[1])
            
            connector.children[0].replaceChild(newpath,oldpath)

            allNodesDragable();
            editableValues();
        }
    }
}
// creates empty div at targetElem, adds box class to it and positions it
// takes 1 parametes: targetElem - node
// returns box
const createBox=(targetElem)=>{
    
    let box = document.createElement('div')
    
    box.classList.add('box')

    box.style.height = targetElem.offsetHeight + 100 + 'px'
    box.style.top = targetElem.offsetTop -50 +'px'
    box.style.left = targetElem.offsetLeft - 50 + 'px'
    box.style.paddingRight = targetElem.offsetWidth*2 + 20 + 'px'
    return box
}
// creates bounding box for element and handles its margins
// on node mouseover while draging in absolute position
const onElemEnter=(event)=>{

    targetElem = event.target
    let allNodes = document.querySelectorAll('.node-base')

    box = createBox(targetElem)
    list.appendChild(box)
    
    targetElem.style.zIndex = 0
    targetElem.classList.add('trans')
    targetElem.removeEventListener('mouseenter',onElemEnter)
    targetElem.addEventListener('mouseleave',onElemLeave)
    
    if(allNodes.length == 1){
        targetElemCurrRight = window.getComputedStyle(targetElem).marginRight.slice(0,-2)
        targetElem.style.marginRight = Number(targetElemCurrRight)+ 100+ 'px'
    }else{
        if(targetElem.classList.contains('head')){
            targetElem.style.marginRight = 100 + 'px'
            targetElem.nextElementSibling.style.marginLeft = 60 +'px'
        }else if(targetElem.classList.contains('tail')){
            targetElem.style.marginLeft = '150px'
        }else{
            targetElem.style.marginLeft = '150px'
            targetElem.style.marginRight = '-20px'
        }
    }
}   
// handles eventlisteners when mouse leaves element
const onElemLeave=()=>{
    targetElem.removeEventListener("mouseleave",onElemLeave)
    box.addEventListener('mouseenter',onBoxEnter)
    
}
// handles eventlisteners when mouse enters bounding box
const onBoxEnter=()=>{
    box.removeEventListener('mouseenter',onBoxEnter)
    box.addEventListener('mouseleave',onBoxLeave)
    document.onmouseup = dropOnBox
}
// handles eventlisteners when mouse leaves bounding box
// calls 1 Function: setMargins 
const onBoxLeave=()=>{
    box.removeEventListener('mouseleave',onBoxLeave)
    box.remove()

    targetElem.style.zIndex = '2'

    setMargins(targetElem)

    if(document.onmouseup == dropOnBox){
        document.onmouseup = dropAbs
    }
    targetElem.addEventListener("mouseenter", onElemEnter)
    targetElem.classList.remove('trans')
}
// allows dragged node to be dropped onto the list thus appends it into list
// first checks if lit is at max capacity
// removes bounding box, positions elem in the list and handles event listeners
// calls functions: setMargins, removeBBFromAllNodes, handleHeadTail, handleMissingConnectors, handleValues
const dropOnBox=()=>{

    document.onmousemove = null;
    document.onmouseup = null;

    if(allNodes.length == 5){
        popUp('Max number of nodes in list is 5')
        elem.style.top =  '30px'
        
        onBoxLeave()
        removeBBFromAllNodes()
        
        return
    }
    
    list.removeChild(elem)
    elem.classList.remove('drag-abs')
    
    targetElem.insertAdjacentElement('beforebegin',elem)
    targetElem.style.zIndex = '2'
    elem.style.zIndex = '2'
    elem.classList.add('node-base')
    elem.style.marginTop = '60px'
    elem.style.left = 'unset'
    elem.style.top = 'unset'

    box.removeEventListener('mouseleave',onBoxLeave)
    box.remove()
    targetElem.addEventListener("mouseenter", onElemEnter);

    setMargins(targetElem)

    removeBBFromAllNodes()
    handleHeadTail();
    handleMissingConnectors();
    handleValues();
}
// adds bounding box to all nodes, called when draging node in absolute position
const addBBToAllNodes=()=>{
    allNodes = document.querySelectorAll('.node-base');
    
    for (let i = 0; i < allNodes.length; i++){
        allNodes[i].addEventListener("mouseenter", onElemEnter);
        
    };
}
// removes bounding box from all nodes, called when node is droped in absolute position or onto the list
const removeBBFromAllNodes=()=>{
    allNodes = document.querySelectorAll('.node-base');
    
    for (let i = 0; i < allNodes.length; i++){
        allNodes[i].removeEventListener("mouseenter", onElemEnter);
    };
}

// Replaces NEXT value of all node-base elements with next node data value
const handleValues=()=>{
    let allNodes = document.querySelectorAll('.node-base')

    for (let i = 0; i < allNodes.length; i++) {
        if( 
            allNodes[i].nextElementSibling
            && !allNodes[i].nextElementSibling.classList.contains('drag-abs')){

            let nextConnector = allNodes[i].nextElementSibling;
            let nextnodeElem = nextConnector.nextElementSibling;
    
            let nextnodeElemData = nextnodeElem.children[0].children[0].innerText;
    
            allNodes[i].children[1].children[0].innerText = nextnodeElemData;
        }// if next node doesnt exist or is outside of list '.drag-abs' replace next value with 3 spaces
        else if (
                !allNodes[i].nextElementSibling
                || allNodes[i].nextElementSibling.classList.contains('drag-abs')){

                allNodes[i].children[1].children[0].innerText = "\u00A0\u00A0\u00A0"

        }
    }    
}
// allows data value to be editable by mousedown event
const onValueClick=()=>{
    storedValue = elem.children[0].children[0].innerText
    elem.children[0].children[0].innerText = '_'
    document.onkeypress = onValueKeypress
    document.onmousedown = finishEditing
}
// handles backspace event during edition of data value
// calls 1 function: handleValues
const erase=(event)=>{
    if(event.keyCode == 8){
        elem.children[0].children[0].innerText = elem.children[0].children[0].innerText.slice(0,-1)

        if(!elem.children[0].children[0].innerText.length){

            elem.children[0].children[0].innerText = '_'
        }
        handleValues()
    }
}
// handles edition of data value
const onValueKeypress=(event)=>{
    
    // handle backspace
    document.onkeydown = erase
    // remove dash after first char input
    if (elem.children[0].children[0].innerText == '_'){
        elem.children[0].children[0].innerText = ''
    }
    //on enter finish
    if(event.charCode == 13){
        finishEditing();
    }//make sure val doesnt end with space ??
    else if(event.charCode == 32
        && elem.children[0].children[0].innerText.length < 2){
            elem.children[0].children[0].innerText += "\u00A0"
    }//max len is 3 chars
    else if(elem.children[0].children[0].innerText.length < 3){
        elem.children[0].children[0].innerText += event.key
    }
    else{
        popUp("Maximum number of characters DATA value is 3")
    }
    handleValues()
}
// ends edition of data value, checks if value is valid and removes eventlisteners
const finishEditing=()=>{
    let valNext = elem.children[0].children[0].innerText
    if (valNext == "" 
        || valNext == "_"
        || valNext == "\u00A0"
        || valNext == "\u00A0\u00A0"
        || valNext == "\u00A0\u00A0\u00A0"){
            elem.children[0].children[0].innerText = storedValue
            popUp("Value is invalid and has not been changed")
    }
    document.onkeypress = null
    document.onkeydown = null
    document.onmousedown = null
}
// allows data value of all nodes to be edited by clicking it
const editableValues=()=>{
    let allNodes = document.querySelectorAll('.node-base')

    for (let i = 0; i < allNodes.length; i++) {
        allNodes[i].children[0].children[0].addEventListener('click',onValueClick)
    }
}

