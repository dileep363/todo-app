import React,{useEffect,useState} from 'react';
import Button from '@mui/material/Button';
import "./CreateTodo.css";

const URL="https://jsonplaceholder.typicode.com/users/1/todos";
const CreateTodo = () => {
    const [data,setData]=useState([]);
    const [input,setInput]=useState({id:"",title:"",completed:false});
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState({msg:"",isError:false});
    const [edit,setEdit]=useState({
        id:"",
        isEditable:false
    });
    const [filter,setFilter]=useState("all");

    const addTask=async (e)=>{
        e.preventDefault();
        setLoading(true);
        setData([...data,{...input,
            id:Date.now(),
            title:input.title,
            completed:input.completed
        }]);
        setInput({...input,title:""});
        setLoading(false);
    }
    
    const handleDelete=(id)=>{
        const newTodos=data.filter((eachItem)=>{
            return eachItem.id!==id;
        });
        setData(newTodos);
    }  

    const handleComplete=(id)=>{
       const newTodos=data.map((eachItem)=>
        eachItem.id===id? {...eachItem,completed:true}:eachItem
       );
       setData(newTodos);
      }
    
    const handleEdit=(id)=>{
        setEdit({
            ...edit,
            id:id,
            isEditable:true
        });
        let editItem=data.find((eachItem)=>eachItem.id===id);
        setInput({...input,id:editItem.id,title:editItem.title,completed:editItem.completed})
        
    }
    const editUpdate=(e)=>{
        e.preventDefault();
        const newTodos=data.map((eachItem)=>
        eachItem.id===edit.id? {...eachItem,title:input.title,completed:false}:eachItem
       );
       setData(newTodos);
       setInput({...input,title:""});
       setEdit({...edit,id:'',isEditable:false})

    }
    
    const fetchData=async ()=>{
        setLoading(true);
        setError({...error})
        try {
            const response= await fetch(URL);
            const newData=await response.json();
            setData(newData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError({...error,msg:"Something went wrong",isError:true})
        }
    }

    useEffect(()=>{
        
        fetchData();
    },[]);

    

  return (
    <div>
        <h1>Todo App</h1>
        <div className='inputform'>
            <form >
            
                <input type="text" placeholder='Enter Task' className='inputfield' required value={input.title} onChange={(e)=>{setInput({...input,title:e.target.value});}}/>
                <br /><br />
                {
                    edit.isEditable? 
                    <Button variant="contained" onClick={(e)=>editUpdate(e)}>Edit Task</Button>
                :<Button variant="contained"  onClick={(e)=>{addTask(e)}} >Create Task</Button>}
                
        
            </form>
        </div>
        <hr />
        
            <div>
                <Button variant="contained" onClick={() => setFilter('all')}>All Tasks</Button>&nbsp;&nbsp;
                <Button variant="contained" onClick={() => setFilter('completed')}>Completed Tasks</Button>
            </div>
            {filter==='all'?<h1>All Tasks</h1>:<h1>Completed Tasks</h1>}
       
        <div className="displaydata">  
        {loading?<h2>Loading....</h2>:error.isError?<h2>error.msg</h2>:data.length===0?<h2>There are No Tasks in the List</h2>:""}    
           
            {
                Array.isArray(data) ?(
                data.filter((eachObj)=>filter==='all' || (filter==='completed' && eachObj.completed ))
                .sort((a,b)=>
                    a.id<b.id?1:-1
                )
                .map((eachObj)=>{
                    const {id,title,completed}=eachObj;
                    return <div key={id} className='eachtodo'>
                        
                        <h3 className='data'  style={completed?{color:"green"}:{color:"red"}} >{title}</h3>
                        <div >
                            <Button variant="contained" className='buttons' onClick={()=>{handleEdit(id)}}>Edit</Button>&nbsp;&nbsp;
                            <Button variant="contained" className='buttons' onClick={()=>handleDelete(id)}>Delete</Button>&nbsp;&nbsp;
                            {completed?"":<Button variant="contained" className='buttons' onClick={()=>handleComplete(id)}>Complete</Button>}
                        </div>
                    </div>
                }) ):<h1> Data is not in the Expected Format</h1>
            }
        </div>
    </div>
  )
}

export default CreateTodo;
