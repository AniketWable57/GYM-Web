// Function to fetch users and display them
// Function to fetch users and display them
async function fetchAndDisplayUsers() {
    try {
        const response = await fetch('http://127.0.0.1:5000/users');
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        if (!data.users) {
            throw new Error("No 'users' field in response");
        }

        const membersContainer = document.getElementById('members-container');
        membersContainer.innerHTML = ''; // Clear existing content

        data.users.forEach(user => {
            const memberCard = document.createElement('div');
            memberCard.classList.add('member-card');
            memberCard.innerHTML = `
                <h3>${user.email}</h3>
                <p><strong>Mobile:</strong> ${user.mobile_no}</p>
                <p><strong>Address:</strong> ${user.address}</p>
                <div class="card-buttons">
                    <button class="update-btn" data-id="${user.id}">Update</button>
                    <button class="delete-btn" data-id="${user.id}">Delete</button>
                </div>
            `;
            membersContainer.appendChild(memberCard);

            const updateButton = memberCard.querySelector('.update-btn');
            const deleteButton = memberCard.querySelector('.delete-btn');

            updateButton.addEventListener('click', () => populateUpdateForm(user));
            deleteButton.addEventListener('click', () => deleteUser(user.id));  // Pass user.id to deleteUser function
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        const membersContainer = document.getElementById('members-container');
        membersContainer.innerHTML = `<p class="error">Failed to load members. Please try again later.</p>`;
    }
}

// Function to handle deleting a user
async function deleteUser(userId) {
    try {
        // Make DELETE request to the server
        const response = await fetch(`http://127.0.0.1:5000/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is okay
        if (!response.ok) {
            const result = await response.json();
            alert(result.error || 'An error occurred while deleting the user.');
            return;
        }

        // Successfully deleted the user, refresh the user list
        alert('User deleted successfully!');
        fetchAndDisplayUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user. Please try again.');
    }
}


// Function to populate the form with user data for updating
function populateUpdateForm(user) {
    const form = document.getElementById('add-member-form');
    const title = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    
    // Populate the form with user data
    form.querySelector('#member-name').value = user.name;
    form.querySelector('#member-email').value = user.email;
    form.querySelector('#member-phone').value = user.mobile_no;
    form.querySelector('#member-address').value = user.address;
    form.querySelector('#user-id').value = user.id;

    title.innerHTML = "Update Member";  // Change form title to "Update"
    submitButton.innerHTML = "Update Member";  // Change submit button text to "Update"
}



// Function to handle adding or updating a user
async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    const userId = jsonData.user_id;
    try {
        let response;
        if (userId) {
            // If userId exists, we are updating the user
            response = await fetch(`http://127.0.0.1:5000/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: jsonData.name,
                    email: jsonData.email,
                    mobile_no: jsonData.mobile_no,
                    address: jsonData.address,
                }),
            });
        } else {
            // If no userId exists, we are adding a new user
            response = await fetch('http://127.0.0.1:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });
        }

        const result = await response.json();
        if (response.ok) {
            alert(userId ? 'Member updated successfully!' : 'Member added successfully!');
            fetchAndDisplayUsers();  // Refresh the user list after add/update
            event.target.reset(); // Reset the form
            document.getElementById('form-title').innerHTML = 'Add New Member'; // Reset title
            document.getElementById('submit-button').innerHTML = 'Add Member'; // Reset submit button text
        } else {
            alert(result.error || 'An error occurred.');
        }
    } catch (error) {
        console.error('Error handling form submission:', error);
        alert('An error occurred. Please try again.');
    }
}

// Add event listener for form submission (both Add and Update)
document.getElementById('add-member-form').addEventListener('submit', handleFormSubmit);

// Call the function to fetch and display users on page load
window.onload = fetchAndDisplayUsers;
