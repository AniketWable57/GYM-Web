document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("add-trainer-form");

    // Fetch and display trainers on page load
    fetchTrainers();

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Collect form data
        const name = document.getElementById("trainer-name").value;
        const experience = document.getElementById("experience").value;
        const expertise = Array.from(document.querySelectorAll("input[name='expertise']:checked")).map(el => el.value);
        const imageUrl = document.getElementById("trainer-image").value;

        if (expertise.length === 0) {
            alert("Please select at least one area of expertise.");
            return;
        }

        // Prepare data payload
        const data = {
            name: name,
            experience: experience,
            expertise: expertise.join(", "),
            image_url: imageUrl
        };

        try {
            // Send data to the API
            const response = await fetch('http://127.0.0.1:5000/add_trainer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to add trainer');
            }

            const result = await response.json();
            console.log("Trainer added:", result);

            // Add trainer to the DOM
            addTrainerToDOM(data);

            // Reset the form after submission
            form.reset();

            // Show success toast
            showToast("Trainer added successfully!");
        } catch (error) {
            console.error("Error adding trainer:", error);
            alert("An error occurred while adding the trainer. Please try again.");
        }
    });

    async function fetchTrainers() {
        try {
            const response = await fetch('http://127.0.0.1:5000/get_trainers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch trainers');
            }

            const trainers = await response.json();
            console.log("Fetched trainers:", trainers);

            trainers.forEach(addTrainerToDOM);
        } catch (error) {
            console.error("Error fetching trainers:", error);
            alert("An error occurred while fetching trainers. Please try again.");
        }
    }
    function addTrainerToDOM(trainer) {
        const container = document.getElementById("trainers-container");
    
        // Create a card for the trainer
        const trainerCard = document.createElement("div");
        trainerCard.className = "trainer-card";
    
        const expertiseBadges = trainer.expertise
            .split(", ")
            .map(expertise => `<span class="expertise-badge">${expertise}</span>`)
            .join("");
    
        trainerCard.innerHTML = `
            <img src="${trainer.image_url}" alt="${trainer.name}'s photo" class="trainer-image">
            <h3>${trainer.name}</h3>
            <p>Experience: ${trainer.experience} years</p>
            <div>${expertiseBadges}</div>
            <div class="card-buttons">
                <button class="update-btn" data-name="${trainer.name}">Update</button>
                <button class="delete-btn" data-name="${trainer.name}">Delete</button>
            </div>
        `;
    
        container.appendChild(trainerCard);
    
        // Add event listeners for buttons
        const updateBtn = trainerCard.querySelector(".update-btn");
        const deleteBtn = trainerCard.querySelector(".delete-btn");
    
        updateBtn.addEventListener("click", () => updateTrainer(trainer));
        deleteBtn.addEventListener("click", () => deleteTrainer(trainer.name, trainerCard));
    }

    
    function deleteTrainer(name, trainerCard) {
        if (!confirm(`Are you sure you want to delete trainer ${name}?`)) return;
    
        fetch(`http://127.0.0.1:5000/delete_trainer`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to delete trainer.");
                alert("Trainer deleted successfully!");
                trainerCard.remove(); // Remove from UI
            })
            .catch(error => {
                console.error("Error deleting trainer:", error);
                alert("An error occurred while deleting the trainer.");
            });
    }

    
    function updateTrainer(trainer) {
        const updatedName = prompt("Enter new name:", trainer.name) || trainer.name;
        const updatedExperience = prompt("Enter new experience (years):", trainer.experience) || trainer.experience;
        const updatedExpertise = prompt("Enter new expertise (comma-separated):", trainer.expertise) || trainer.expertise;
    
        const updatedData = {
            name: updatedName,
            experience: updatedExperience,
            expertise: updatedExpertise,
            image_url: trainer.image_url, // Retain the same image URL
        };
    
        fetch(`http://127.0.0.1:5000/update_trainer`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to update trainer.");
                alert("Trainer updated successfully!");
                location.reload(); // Refresh to reflect changes
            })
            .catch(error => {
                console.error("Error updating trainer:", error);
                alert("An error occurred while updating the trainer.");
            });
    }
    

    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("show");
        }, 10); // Add a slight delay to allow CSS transition

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.remove();
            }, 300); // Wait for the fade-out transition
        }, 3000); // Show the toast for 3 seconds
    }
});
