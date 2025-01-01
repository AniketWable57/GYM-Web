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