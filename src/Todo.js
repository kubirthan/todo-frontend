import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1)
  const apiurl = "http://localhost:8000";

  //edit
  
  const [editTitle, setEdittitle] = useState("");
  const [editdescription, setEditDescription] = useState("");

  const handleSubmit = () => {
    setError("");
    //check inputs
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiurl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            //add item to list
            setTodos([...todos, { title, description }]);
            setMessage("Item added successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            //set error
            setError("Unable to create todo item");
          }
        })
        .catch(() => {
          setError("Unable to create todo item");
        });
    }
  };

  useEffect(() => {
    getItems()
  },[])

  const getItems = () => {
    fetch(apiurl+"/todos")
    .then((res) => res.json())
    .then((res) => {
        setTodos(res)
    })
  }

  const handleEdit = (item) => {
    setEditId(item._id)
    setEdittitle(item.title)
    setEditDescription(item.description)
}

  const handleupdate = () => {
    setError("");
    //check inputs
    if (editTitle.trim() !== "" && editdescription.trim() !== "") {
      fetch(apiurl + "/todos"+editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            //update item to list
            const updatedTodos = todos.map((item) => {
                if(item._id == editId) {
                    item.title = editTitle
                    item.description = editdescription
                }
                return item
            })
            //add item to list
            setTodos(updatedTodos);
            setMessage("Item updated successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);

            setEditId(-1)
            
          } else {
            //set error
            setError("Unable to create todo item");
          }
        })
        .catch(() => {
          setError("Unable to create todo item");
        });
  }

  const handleEditCancel = () => {
    setEditId(-1)
  }

  return (
    <>
      <div className="row bg-success p-3 text-light">
        <h1>Todo project with MERN stack</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            value={title}
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            value={description}
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row mt-3">
        <h3>Tasks</h3>
        <ul className="list-group ">
            {todos.map((item) => 
            <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
            <div className="d-flex flex-column me-2">
                {
                    editId == -1 || editId !== item._id ? <>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                    </> : <>
                    <div>
                    <div className="form-group d-flex gap-2">
          <input
            placeholder="Title"
            onChange={(e) => setEdittitle(e.target.value)}
            className="form-control"
            value={editTitle}
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setEditDescription(e.target.value)}
            className="form-control"
            value={editdescription}
            type="text"
          />
        </div>
                    </div>
                    </>
                }
              
            </div>
            <div className="d-flex gap-2">
                {editId == -1 || editId !== item._id  ?  <button className="btn btn-warning" onClick={(item) => handleEdit(item)}>Edit</button>
                : <button type="button" onClick={handleupdate}>Update</button>}
              {editId == -1 ? <button className="btn btn-danger">Delete</button> : 
              <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
              }
              
              
            </div>
          </li>
            )}
          
        </ul>
      </div>
    </>
  );
}
}