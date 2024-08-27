(function(){
    "use strict"
    angular.module("ShoppingListComponentsApp",[])
    .controller('ShoppingListController',ShoppingListController)
    
    .factory('ShoppingListFactory',ShoppingListFactory)
    .component("shoppingList",{
        templateUrl:'shoppingList.html',
        controller:ShoppingListComponentController,
        bindings:{
            items:"<",// for all inside items
            myTitle:"@title",//for string 
            onRemove:"&" // refrence (call-back fun)
        }
    })
    
    
    ShoppingListComponentController.$inject = ["$element"]
    function ShoppingListComponentController($element){
        let $ctrl = this
    let totalElem 
        $ctrl.cookiesInList = function(){
            for (let i = 0; i < $ctrl.items.length; i++) {
                let name = $ctrl.items[i].name
                console.log(name);
                if(name.toLowerCase().indexOf("cookie") !== -1){
                    
                    return true
                }
              
                
            }
            return false
        }
        $ctrl.remove = function(myIndex){
         $ctrl.onRemove({index:myIndex})
        }
        $ctrl.$onInit = function (){
           totalElem = 0
        }
        $ctrl.$doCheck = function(){
            if($ctrl.items.length !== totalElem){
                totalElem = $ctrl.items.length
                if($ctrl.cookiesInList()){
                    let findElem = $element.find("div.error")
                    findElem.slideDown(900)
                    
                }else{
                    let findElem = $element.find("div.error")
                    findElem.slideUp(900)
                }
            }
         
        }
    }
    
    ShoppingListController.$inject = ['ShoppingListFactory']
    function ShoppingListController(ShoppingListFactory){
    let list = this
    
    let shoppingList = ShoppingListFactory()
    list.items = shoppingList.getItems()
    list.itemName = ""
    list.itemQuantity = ""
    list.warning = "COOKIES DETECTED!"
    let origTilte = "Shopping List #1"
    list.title = origTilte + " (" + list.items.length + "Items" + ")"
    
    list.addItem = function(){
       
            shoppingList.addItem(list.itemName,list.itemQuantity)
            list.title = origTilte + " (" + list.items.length + " Items" + ")"
       
    }
    list.removeItem = function(index){
        this.lastRemoved = "Last Item Removed was " + list.items[index].name
    shoppingList.removeItem(index)
    list.title = origTilte + " (" + list.items.length + "Items" + ")"
    }
    
    }
    
    
    function ShoppingListService(maxItems){
        let service = this
    
    let items = []
    service.addItem = function(itemName,quantity){
    if((maxItems === undefined) ||
     (maxItems !== undefined )&& (items.length < maxItems)){
        let item = {
            name:itemName,
            quantity:quantity
        }
        items.push(item)
    }else{
      
            throw new Error("Max items (" + maxItems + ") reached.");
        
    }
    
    }
    service.removeItem = function(itemIndex){
        items.splice(itemIndex,1)
        }
        service.getItems = function(){
            return items
        }
    }
    function ShoppingListFactory(){
        let factory = function(maxItems){
            return new ShoppingListService(maxItems)
        }
        return factory
    }
    })()