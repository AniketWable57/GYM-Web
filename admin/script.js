document.getElementById('add-class-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the form from reloading the page

    // Gather form data
    const className = document.getElementById('class-name').value;
    const instructor = document.getElementById('instructor').value;
    const day = document.getElementById('schedule').value;
    const description = document.getElementById('description').value;
    const imageUrl = document.getElementById('image-url').value;

    // Prepare the request payload
    const requestData = {
        class_name: className,
        instructor: instructor,
        day: day,
        description: description,
        image_url: imageUrl
    };

    try {
        // Send the request to the API
        const response = await fetch('http://127.0.0.1:5000/add_class', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            const result = await response.json();
            alert('Class added successfully!');
            console.log(result);
        } else {
            const error = await response.json();
            alert('Error adding class: ' + error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the class.');
    }
});


let classes = []; // This will store the fetched classes
let currentClassId = ""; // Store the ID of the class being edited

// Fetch all classes and render the list
function fetchClasses() {
    fetch('http://127.0.0.1:5000/get_classes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            classes = data; // Store the fetched classes in the array
            renderClassList(); // Render the class list
        })
        .catch(error => {
            console.error('Error fetching classes:', error);
        });
}



// Update an existing class
function updateClass() {
    const className = document.getElementById("class-name").value;
    const instructor = document.getElementById("instructor").value;
    const day = document.getElementById("day").value;
    const description = document.getElementById("class-description").value;
    const imageUrl = document.getElementById("image-url").value;

    if (!className || !instructor || !day || !description || !imageUrl) {
        alert("Please fill in all fields.");
        return;
    }

    const classData = {
        class_name: className,
        instructor: instructor,
        day: day,
        description: description,
        image_url: imageUrl
    };

    fetch(`http://127.0.0.1:5000/update_class/${currentClassId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(classData)
    })
        .then(response => response.json())
        .then(data => {
            alert('Class updated successfully');
            fetchClasses(); // Refresh the class list
            resetForm(); // Clear the form
        })
        .catch(error => {
            console.error('Error updating class:', error);
        });
}

// Delete a class
function deleteClass() {
    fetch(`http://127.0.0.1:5000/delete_class/${currentClassId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            alert('Class deleted successfully');
            fetchClasses(); // Refresh the class list
            resetForm(); // Clear the form
        })
        .catch(error => {
            console.error('Error deleting class:', error);
        });
}

// Render the class list on the page with cards
// Render the class list on the page with cards
function renderClassList() {
    const classContainer = document.getElementById("class-container");
    classContainer.innerHTML = ""; // Clear previous content

    classes.forEach(classItem => {
        const classCard = document.createElement("div");
        classCard.classList.add("class-card");

        const classId = classItem._id && classItem._id.id ? classItem._id.id : classItem._id;  // Adjust if necessary

        classCard.innerHTML = `
            <img src="${classItem.image_url}" alt="${classItem.class_name}">
            <div class="class-card-content">
                <h3>${classItem.class_name}</h3>
                <p><strong>Instructor:</strong> ${classItem.instructor}</p>
                <p><strong>Schedule:</strong> ${classItem.day}</p>
                <p>${classItem.description}</p>
                <div class="button-group">
                    <button class="edit-button" onclick="editClass('${classId}')">Edit</button>
                    <button class="delete-button" onclick="removeClass('${classId}')">Delete</button>
                </div>
            </div>
        `;
        classContainer.appendChild(classCard);
    });
}




// Edit a class
function editClass(classId) {
    const classToEdit = classes.find(cls => cls._id === classId);
    document.getElementById("class-name").value = classToEdit.class_name;
    document.getElementById("instructor").value = classToEdit.instructor;
    document.getElementById("day").value = classToEdit.day;
    document.getElementById("class-description").value = classToEdit.description;
    document.getElementById("image-url").value = classToEdit.image_url;

    currentClassId = classId;
    document.getElementById("submit-button").innerText = "Save Changes";
    document.getElementById("update-button").style.display = "inline-block";
    document.getElementById("delete-button").style.display = "inline-block";
}

// Remove a class
function removeClass(classId) {
    console.log("Deleting class with ID:", classId); // Debugging line
    if (confirm("Are you sure you want to delete this class?")) {
        fetch(`http://127.0.0.1:5000/delete_class/${classId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete class');
                }
                return response.json();
            })
            .then(data => {
                alert('Class deleted successfully');
                fetchClasses(); // Refresh the class list
            })
            .catch(error => {
                console.error('Error deleting class:', error);
                alert('An error occurred while deleting the class.');
            });
    }
}







// Reset the form fields
function resetForm() {
    document.getElementById("class-name").value = "";
    document.getElementById("instructor").value = "";
    document.getElementById("day").value = "";
    document.getElementById("class-description").value = "";
    document.getElementById("image-url").value = "";
    document.getElementById("submit-button").innerText = "Add Class";
    document.getElementById("update-button").style.display = "none";
    document.getElementById("delete-button").style.display = "none";
}

// Fetch classes on page load
window.onload = fetchClasses;