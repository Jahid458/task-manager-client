import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { IoIosAddCircleOutline } from "react-icons/io";
import { authContext } from "../../Provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Home = () => {
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "To-Do",
    description: "",
  });
  const [localTasks, setLocalTasks] = useState([]); // Local state for tasks
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(authContext);

  // Fetch tasks from the backend and update local state
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/tasks/${user?.email}`);
      setLocalTasks(res.data); // Update local state with fetched tasks
      return res.data;
    },
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        category: task.category,
        description: task.description,
      });
    }
  }, [task]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const date = new Date();
    const taskDate = date.toLocaleDateString("en-GB").split("/").join("-");

    const taskList = {
      title: formData.title,
      description: formData.description,
      taskDate: taskDate,
      category: formData.category,
      email: user?.email,
    };

    axiosPublic.post("/tasks", taskList).then((res) => {
      if (res.data.insertedId) {
        toast.success("Task added successfully");
      }
      refetch();
    });

    document.getElementById("my_modal_1").close();
  };

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
              refetch();
            }
          });
      }
    });
  };

  const handleUpdate = (task) => {
    setTask(task);
    document.getElementById("my_modal_2").showModal();
  };

  const handleTaskUpdate = async (e) => {
    e.preventDefault();

    const taskList = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
    };

    await axiosPublic.put(`/taskUpdate/${task._id}`, taskList);
    toast.success("Task Updated Successfully");
    refetch();

    document.getElementById("my_modal_2").close();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Clone tasks for local update
    const updatedTasks = [...localTasks];

    // Find the dragged task
    const draggedTaskIndex = updatedTasks.findIndex((task) => task._id === draggableId);
    const draggedTask = updatedTasks[draggedTaskIndex];

    // Remove from old position
    updatedTasks.splice(draggedTaskIndex, 1);

    // Insert into new position
    updatedTasks.splice(destination.index, 0, { ...draggedTask, category: destination.droppableId });

    // Update local state instantly
    setLocalTasks(updatedTasks);

    // Send update request to backend
    try {
      const response = await axiosPublic.put("/tasks/reorder", {
        tasks: updatedTasks,
        email: user?.email,
      });

      if (response.status === 200) {
        toast.success("Tasks reordered successfully");
      } else {
        toast.error("Failed to reorder tasks");
      }
    } catch (error) {
      toast.error("Failed to reorder tasks");
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-11/12 mx-auto">
        <div
          className="bg-gray-200 flex flex-col justify-center items-center max-w-[350px] h-[150px] mt-6"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          <span>
            <IoIosAddCircleOutline className="text-3xl" />
          </span>{" "}
          Add Task
        </div>

        {/* Task List Section */}
        <div className="w-11/12 mx-auto mt-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Task List</h2>

          <DragDropContext onDragEnd={onDragEnd}>
            {/* Grid layout for categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {["To-Do", "In Progress", "Done"].map((category) => (
                <Droppable droppableId={category} key={category}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="p-4 border rounded-lg shadow-md bg-gray-100"
                    >
                      <h3 className="text-xl font-semibold text-center mb-3">{category}</h3>

                      {localTasks.filter((task) => task.category === category).length > 0 ? (
                        localTasks
                          .filter((task) => task.category === category)
                          .map((data, index) => (
                            <Draggable key={data._id} draggableId={data._id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-3 border rounded-md bg-white shadow-sm mb-2"
                                >
                                  <h4 className="text-lg font-medium">{data.title}</h4>
                                  <p className="text-gray-600">{data.description}</p>
                                  <p className="text-sm text-gray-500">Date: {data.taskDate}</p>
                                  <div className="flex justify-end gap-2 mt-2">
                                    <button onClick={() => handleUpdate(data)} className="text-blue-500 hover:text-blue-700">
                                      <FiEdit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(data._id)} className="text-red-500 hover:text-red-700">
                                      <MdDelete size={18} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                      ) : (
                        <p className="text-gray-500 text-center">No tasks in this category.</p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>

        {/* Add Task Modal */}
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add Task</h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Task Title"
                className="input input-bordered w-full"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Task Description"
                className="textarea textarea-bordered w-full"
              ></textarea>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => document.getElementById("my_modal_1").close()}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </dialog>

        {/* Update Task Modal */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Update Task</h3>
            <form onSubmit={handleTaskUpdate} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full"
              ></textarea>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => document.getElementById("my_modal_2").close()}>
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