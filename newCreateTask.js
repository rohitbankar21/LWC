import { LightningElement,api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import saveToDo from '@salesforce/apex/ToDoController.saveToDo';


export default class NewCreateTask extends LightningElement {
    @api targetParent;
    taskTitle;
    dueDate;
    showDueDate=false;
    showSave=false;

    connectedCallback(){
        console.log('target parent is'+this.targetParent);
    }

    handleOnChange(event){
        const fieldName=event.target.name;
        if(fieldName==='taskTitle'){
            this.taskTitle=event.target.value;
            console.log("title is "+ this.taskTitle)
            if(this.taskTitle!=""){
                this.showDueDate=true;
            }
            else{
                this.showDueDate=false;
            }
        }
        else if(fieldName==='dueDate'){
            this.dueDate=event.target.value;
            console.log("due date is "+this.dueDate);
            if(this.dueDate!="" && this.targetParent!=true){
                this.showSave=true;
            }
            else{
                this.showSave=false;
            }
        }

    }

    handleClick(){
        console.log("buttons click on child");
        saveToDo({title:this.taskTitle,dueDate:this.dueDate})
        .then((result)=>{
            if(result==='Success'){
                this.taskTitle='';
                this.dueDate='';
                const event = new ShowToastEvent({
                    title: 'Success',
                    message:
                        'A new item has been added in your Todo list',
                    variant:'success'
                });
                this.dispatchEvent(event);
                this.dispatchEvent(new CustomEvent('refreshtodo'));
                if(this.targetParent===true){
                    const selectedEvent=new CustomEvent('closeaction',{
                        detail:result
                    });
                    this.dispatchEvent(selectedEvent);
                }

            }
        }
    )
        .catch((error)=>{
            console.log('error is '+error)
            const event = new ShowToastEvent({
                title: 'Error',
                message: error.body.message,
                variant:'error'
            });
            this.dispatchEvent(event);
        }
    );
    }
    @api handleParentClick(){
        this.handleClick();
    }
}
