import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../components/Navbar/Navbar";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { IoIosAddCircleOutline } from "react-icons/io";
import { authContext } from "../../Provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Home = () => {
  const [task,setTask] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const axiosPublic = useAxiosPublic();

  const {user} = useContext(authContext);
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        category: task.category,
        description: task.description,
      });
    }
  }, [task, reset]);

  const onSubmit = async(data) => {
    // console.log("Task Data:", data); 
    const date = new Date();
    const taskDate = date.toLocaleDateString("en-GB").split("/").join("-");
  

    const taskList ={
        title: data.title,
        description:data.description,
        taskDate:taskDate,
        category: data.category,
        email: user?.email
    }
    console.log(taskList);
    axiosPublic.post('/tasks', taskList)
    .then(res =>{
        if(res.data.insertedId){
            toast.success('toast added Successsfully')
        }
        console.log(res);
        refetch();

    })
    document.getElementById("my_modal_1").close(); // Close modal
  };

  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/tasks/${user?.email}`);
      return res.data;
    },
  });
  console.log(tasks);

const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/deleteTasks/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            
            if (data.deletedCount) {
              Swal.fire("Deleted!", "Your task has been deleted.", "success");
            }
            refetch()
          });
      }
    });
  };


  const handleUpdate = (task) =>{
    setTask(task)
    document.getElementById("my_modal_2").showModal()
  }

  const handleTaskUpdate = async(data) =>{
    console.log(data);
    const taskList ={
        title: data.title,
        description:data.description,
        category: data.category,
     
    }
     await axiosPublic.put(`/taskUpdate/${task._id}`, taskList);
     toast.success('Task Updated Successfully')
     refetch()
    
    document.getElementById("my_modal_2").close();

  }



  return (
    <div>
      <Navbar />
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <div className="w-11/12 mx-auto">
        <div
          className="bg-gray-200 flex flex-col justify-center items-center max-w-[350px] h-[150px] mt-6"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          <span><IoIosAddCircleOutline className="text-3xl" /></span> Add Task
        </div>
                        {/* for Update  */}
        
       
        <div className="w-11/12 mx-auto mt-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Task List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((data, index) => 
           (
            <div key={index} className="p-4 border rounded-lg shadow-md bg-gray-100">
              <h3 className="text-lg font-semibold">{data.title}</h3>
              <p className="text-gray-600">{data.description}</p>
              <p className="text-sm text-gray-500">Date: {data.taskDate}</p>
              <p className="text-sm font-medium text-blue-600">Category: {data.category}</p>
              <div className="text-end">
                {/* onClick={() => handleUpdate(task)} */}
                  <button onClick={() => handleUpdate(data)}  className="text-blue-500 hover:text-blue-700 mr-2">
                    <FiEdit size={20} />
                  </button>
                
                  <button onClick={() => handleDelete(data._id)}   className="text-red-500 hover:text-red-700 ">
                    <MdDelete size={20} />
                  </button>
                </div>
            </div>
          )
        )}
      </div>
    </div>

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add Task</h3>
            <p className="py-4">Fill in the details below to add a new task.</p>

            {/* Form with React Hook Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                {...register("title", { required: true, maxLength: 50 })}
                className="input input-bordered w-full"
              />

              <select
                {...register("category")}
                className="select select-bordered w-full"
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>

              <textarea
                placeholder="Task Description"
                {...register("description", { maxLength: 200 })}
                className="textarea textarea-bordered w-full"
              ></textarea>

              {/* Buttons */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("my_modal_1").close()}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </dialog>


        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Update Task</h3>
            <p className="py-4">Fill in the details below to add a new task.</p>

            {/* Form with React Hook Form */}
            <form onSubmit={handleSubmit(handleTaskUpdate)} className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                {...register("title", { required: true, maxLength: 50 })}
                className="input input-bordered w-full"
                defaultValue={task?.title}
              />

              <select
                {...register("category")}
                className="select select-bordered w-full"
                 defaultValue={task?.category}
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>

              <textarea
                placeholder="Task Description"
                {...register("description", { maxLength: 200 })}
                className="textarea textarea-bordered w-full"
                defaultValue={task?.description}
              ></textarea>

              {/* Buttons */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("my_modal_2").close()}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                       Update Task
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Home;
